import { Text, TextInput, TouchableOpacity, View } from "react-native";

export interface RegisterProps {
    username: string;
    setUsername: (username: string) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    handleSubmit: () => void;
}

export const Register = ({
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit
}: RegisterProps) => {

    return (
        <View className="w-full bg-green-50">

            {/* Title */}
            <View className="mb-7 bg-green-50">
                <Text className="text-2xl font-bold text-gray-900">
                    Create Account
                </Text>

                <Text className="text-sm text-gray-400 mt-1">
                    Fill in your details to get started
                </Text>
            </View>

            {/* Username */}
            <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Username
                </Text>

                <TextInput
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900"
                    placeholder="Enter your username"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                    autoCapitalize="none"
                />
            </View>

            {/* Email */}
            <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Email
                </Text>

                <TextInput
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            {/* Password */}
            <View className="mb-7">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Password
                </Text>

                <TextInput
                    className="w-full h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-900"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    secureTextEntry={true}
                    autoCapitalize="none"
                />
            </View>

            {/* Button */}
            <TouchableOpacity
                className="w-full h-14 bg-green-500 rounded-xl items-center justify-center active:bg-green-600"
                onPress={handleSubmit}
                activeOpacity={0.8}
            >
                <Text className="text-white font-bold text-base">
                    Create Account
                </Text>
            </TouchableOpacity>

        </View>
    );
};
