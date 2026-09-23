import React from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

interface ConfirmPopupProps {
    visible: boolean;
    title?: string;
    message?: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

const ConfirmPopup = ({
    visible,
    title = "Confirm Withdrawal",
    message = "Are you sure you want to withdraw your application?",
    onConfirm,
    onCancel,
    loading,
}: ConfirmPopupProps) => {

    const fullAction = async () => {
        try {
            await onConfirm();
            onCancel();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={loading ? undefined : onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        {/* Cancel */}
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                            disabled={loading}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        {/* Confirm */}
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={fullAction}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>
                                    Confirm Withdrawal
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ConfirmPopup;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    popup: {
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },

    message: {
        fontSize: 15,
        color: "#6B7280",
        lineHeight: 22,
        marginBottom: 24,
    },

    buttons: {
        flexDirection: "row",
        gap: 10,
    },

    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
    },

    cancelButton: {
        backgroundColor: "#F3F4F6",
    },

    confirmButton: {
        backgroundColor: "#DC2626",
    },

    cancelText: {
        color: "#374151",
        fontWeight: "600",
    },

    confirmText: {
        color: "#fff",
        fontWeight: "600",
    },
});