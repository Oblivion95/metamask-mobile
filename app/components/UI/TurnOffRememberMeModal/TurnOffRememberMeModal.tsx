import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { OutlinedTextField } from 'react-native-material-textfield';
import { createStyles } from './styles';
import ReusableModal, { ReusableModalRef } from '../ReusableModal';
import WarningExistingUserModal from '../WarningExistingUserModal';
import { strings } from '../../../../locales/i18n';
import { useTheme } from '../../../util/theme';
import Routes from '../../../constants/navigation/Routes';
import { createNavigationDetails } from '../../..//util/navigation/navUtils';
import useValidatePassword from '../../hooks/useValidatePassword';

export const createTurnOffRememberMeModalNavDetails = createNavigationDetails(
  Routes.MODAL.ROOT_MODAL_FLOW,
  Routes.MODAL.TURN_OFF_REMEMBER_ME,
);

const TurnOffRememberMeModal = () => {
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);

  const modalRef = useRef<ReusableModalRef>(null);

  const [passwordText, setPasswordText] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const [doesPasswordMatch] = useValidatePassword();
  const isValidPassword = useCallback(
    async (text: string) => await doesPasswordMatch(text),
    [doesPasswordMatch],
  );

  const checkPassword = async (text: string) => {
    setPasswordText(text);
    setDisableButton(!(await isValidPassword(text)));
  };

  const dismissModal = (cb?: () => void): void =>
    modalRef?.current?.dismissModal(cb);

  const triggerClose = (): void => dismissModal();

  const disableRememberMe = async () => {
    triggerClose();
  };

  return (
    <ReusableModal ref={modalRef}>
      <WarningExistingUserModal
        warningModalVisible
        cancelText={strings('turn_off_remember_me.action')}
        cancelButtonDisabled={disableButton}
        onCancelPress={disableRememberMe}
        onRequestClose={triggerClose}
        onConfirmPress={triggerClose}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.areYouSure}>
            <Text style={[styles.heading, styles.delete]}>
              {strings('turn_off_remember_me.description')}
            </Text>
            <OutlinedTextField
              style={styles.input}
              testID={'TurnOffRememberMeConfirm'}
              autoFocus
              returnKeyType={'done'}
              onChangeText={checkPassword}
              autoCapitalize="none"
              value={passwordText}
              baseColor={colors.border.default}
              tintColor={colors.primary.default}
              placeholderTextColor={colors.text.muted}
              keyboardAppearance={themeAppearance}
            />
          </View>
        </TouchableWithoutFeedback>
      </WarningExistingUserModal>
    </ReusableModal>
  );
};

export default React.memo(TurnOffRememberMeModal);
