import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

export function AppModal({
  visible,
  children,
  onClose,
}: {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.box}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  box: {
    width: '100%',
    maxWidth: 420,
  },
});
