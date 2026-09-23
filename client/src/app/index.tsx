import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { View, Text } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "./context/AuthContext";
import { Alert } from "react-native";
import { Redirect, useRouter } from "expo-router";

export default function RegisterTab() {

    const { login, register, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);


    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            // =========================
            // LOGIN
            // =========================
            if (isRegistered) {
                if (!username.trim() || !password) {
                    throw new Error(
                        "Please enter your username and password."
                    );
                }

                await login(
                    username.trim().toLowerCase(),
                    password
                );

                Alert.alert(
                    "Success",
                    "Login successful."
                );

                return;
            }

            // =========================
            // REGISTER
            // =========================

            if (
                !username.trim() ||
                !email.trim() ||
                !password
            ) {
                throw new Error(
                    "Please fill in all fields."
                );
            }

            // Email validation
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email.trim())) {
                throw new Error(
                    "Please enter a valid email address."
                );
            }

            // Password validation
            const passwordErrors: string[] = [];

            if (password.length < 8) {
                passwordErrors.push(
                    "at least 8 characters"
                );
            }

            if (!/[A-Z]/.test(password)) {
                passwordErrors.push(
                    "one uppercase letter"
                );
            }

            if (!/[a-z]/.test(password)) {
                passwordErrors.push(
                    "one lowercase letter"
                );
            }

            if (!/[0-9]/.test(password)) {
                passwordErrors.push(
                    "one number"
                );
            }

            if (!/[^A-Za-z0-9]/.test(password)) {
                passwordErrors.push(
                    "one special character"
                );
            }

            if (passwordErrors.length > 0) {
                throw new Error(
                    `Password must contain ${passwordErrors.join(", ")}.`
                );
            }

            await register(
                username.trim().toLowerCase(),
                email.trim().toLowerCase(),
                password
            );

            Alert.alert(
                "Success",
                "Account created successfully."
            );

            router.replace("/home");

        } catch (error: any) {
            console.error("Register/Login error:", error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again.";

            Alert.alert("Error", message);

        } finally {
            setSubmitting(false);
        }
    };

    if(loading) {

        return <SafeAreaView><Text>loading...</Text></SafeAreaView>;
    }


    if(isAuthenticated) {
        return <Redirect href="/home" />
    }

    return (
        <SafeAreaView className="flex-1 bg-green-50">
            <View className="flex-1 bg-green-50 px-6">

                {/* Header */}
                <View className="pt-10 pb-8">
                    <Text className="text-4xl font-extrabold text-green-900">
                        Welcome to,
                    </Text>

                    <Text className="text-4xl font-extrabold text-green-500 mt-1">
                        Feedants
                    </Text>

                    <Text className="text-base text-gray-500 mt-3">
                        {isRegistered
                            ? "Welcome back! Login to continue."
                            : "Create an account and get started."}
                    </Text>
                </View>

                {/* Form Card */}
                <View className="bg-green-50 rounded-3xl p-6">

                    {isRegistered ? (
                        <Login
                            username={username}
                            password={password}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            handleSubmit={handleSubmit}
                        />
                    ) : (
                        <Register
                            username={username}
                            password={password}
                            email={email}
                            setUsername={setUsername}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            handleSubmit={handleSubmit}
                        />
                    )}

                </View>

                {/* Switch */}
                <View className="flex-row justify-center items-center mt-7">
                    <Text className="text-gray-500 text-sm">
                        {isRegistered
                            ? "Don't have an account? "
                            : "Already have an account? "}
                    </Text>

                    <Text
                        className="text-green-600 font-bold text-sm"
                        onPress={() => setIsRegistered(prev => !prev)}
                    >
                        {isRegistered ? "Register" : "Login"}
                    </Text>
                </View>

            </View>
        </SafeAreaView>
    );
}
