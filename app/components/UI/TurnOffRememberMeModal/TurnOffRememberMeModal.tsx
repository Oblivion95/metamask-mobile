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
import { doesPasswordMatch } from '../../../util/password';
import Engine from '../../../core/Engine';
import { logOut } from '../../../actions/user';
import { setAllowLoginWithRememberMe } from '../../../actions/security';
import { useDispatch } from 'react-redux';
import SecureKeychain from '../../../core/SecureKeychain';

export const createTurnOffRememberMeModalNavDetails = createNavigationDetails(
  Routes.MODAL.ROOT_MODAL_FLOW,
  Routes.MODAL.TURN_OFF_REMEMBER_ME,
);

const TurnOffRememberMeModal = () => {
  const { colors, themeAppearance } = useTheme();
  const styles = createStyles(colors);
  const dispatch = useDispatch();

  const modalRef = useRef<ReusableModalRef>(null);

  const [passwordText, setPasswordText] = useState<string>('');
  const [disableButton, setDisableButton] = useState<boolean>(true);

  const isValidPassword = useCallback(async (text: string) => {
    const response = await doesPasswordMatch(text);
    return response.valid;
  }, []);

  const checkPassword = useCallback(
    async (text: string) => {
      setPasswordText(text);
      setDisableButton(!(await isValidPassword(text)));
    },
    [isValidPassword],
  );

  const dismissModal = (cb?: () => void): void =>
    modalRef?.current?.dismissModal(cb);

  const turnOffRememberMeAndLockApp = async () => {
    const { KeyringController } = Engine.context as any;
    await SecureKeychain.resetGenericPassword();
    await KeyringController.setLocked();
    dispatch(setAllowLoginWithRememberMe(false));
    dispatch(logOut());
  };

  const disableRememberMe = async () => {
    dismissModal(async () => await turnOffRememberMeAndLockApp());
  };

  return (
    <ReusableModal ref={modalRef}>
      <WarningExistingUserModal
        warningModalVisible
        cancelText={strings('turn_off_remember_me.action')}
        cancelButtonDisabled={disableButton}
        onCancelPress={disableRememberMe}
        onRequestClose={dismissModal}
        onConfirmPress={dismissModal}
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
