<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DriverProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/'
            ],
            'role' => 'required|in:driver,rider',
            'nomor_wa' => 'required|string|max:20',
        ]);

        $user = User::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'nomor_wa' => $request->nomor_wa,
        ]);

        if ($user->role === 'driver') {
            DriverProfile::create([
                'driver_id' => $user->id,
                'is_available' => true,
                'vehicle_merk' => '',
                'vehicle_plat_nomor' => '',
                'vehicle_warna' => '',
                'vehicle_jenis' => '',
                'kapasitas_kursi' => 0,
                'rating' => 5.0,
                'total_trips' => 0
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'role' => 'required|in:driver,rider'
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            if ($user) {
                // Increment login attempts if we had a column (not required by prompt, but mentioned).
                // "Increment login_attempts counter if wrong password. Lock account for 15 minutes after 5 failed attempts by checking a locked_until column"
                // Assuming users table has login_attempts and locked_until:
                $user->login_attempts = ($user->login_attempts ?? 0) + 1;
                if ($user->login_attempts >= 5) {
                    $user->locked_until = now()->addMinutes(15);
                }
                $user->save();
            }
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        if (isset($user->locked_until) && $user->locked_until > now()) {
            throw ValidationException::withMessages([
                'email' => ['Akun terkunci. Coba lagi dalam 15 menit.'],
            ]);
        }

        if ($user->role !== $request->role) {
            throw ValidationException::withMessages([
                'role' => ["Akun ini tidak terdaftar sebagai {$request->role}"],
            ]);
        }

        // Reset login attempts on success
        $user->login_attempts = 0;
        $user->locked_until = null;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        if ($user->role === 'driver') {
            $user->load('driverProfile');
        }
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'nama' => 'sometimes|string|max:100',
            'avatar_url' => 'nullable|string',
            'nomor_wa' => 'sometimes|string|max:20',
        ]);

        $user = $request->user();
        $user->update($request->only('nama', 'avatar_url', 'nomor_wa'));

        return response()->json($user);
    }
}
