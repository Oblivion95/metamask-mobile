import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/common';
import StyledButton from '../StyledButton';
import { strings } from '../../../../locales/i18n';
import NetworkMainAssetLogo from '../NetworkMainAssetLogo';
import { PRIVATENETWORK } from '../../../constants/network';
import {MAINNET, RPC} from '../../../constants/network';
import { connect } from 'react-redux';
import Description from './InfoDescription';

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.white,
		borderRadius: 10,
	},
	modalContentView: {
		padding: 20,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
		marginVertical: 10,
		textAlign: 'center',
	},
	tokenView: {
		marginBottom: 30,
	},
	tokenType: {
		backgroundColor: colors.grey100,
		marginRight: 50,
		marginLeft: 50,
		padding: 10,
		borderRadius: 40,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	ethLogo: {
		width: 30,
		height: 30,
		overflow: 'hidden',
		marginHorizontal: 5,
	},
	tokenText: {
		fontSize: 15,
		textTransform: 'capitalize',
	},
	messageTitle: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
	},
	descriptionViews: {
		marginBottom: 15,
	},
	closeButton: {
		marginVertical: 20,
	},
	rpcUrl: {
		fontSize: 10,
		color: colors.grey500,
		textAlign: 'center',
		paddingVertical: 5,
	},
	unknownWrapper: {
		backgroundColor: colors.grey300,
		marginRight: 6,
		height: 20,
		width: 20,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	unknownText: {
		color: colors.white,
		fontSize: 13,
	},
});

interface NetworkInfoProps {
	onClose: () => void;
	type: string;
	ticker: string;
	networkProvider: {
		nickname: string;
		type: string;
		ticker: {
			networkTicker: string;
		}
	}
}

const NetworkInfo = (props: NetworkInfoProps): JSX.Element => {
	const { onClose, ticker, networkProvider: {nickname, type, ticker: networkTicker} } = props;
	return (
		<View style={styles.wrapper}>
			<View style={styles.modalContentView} testID={'education-modal-container-id'}>
				<Text style={styles.title}>You have switched to</Text>
				<View style={styles.tokenView}>
					<View style={styles.tokenType}>
						{ticker === PRIVATENETWORK ? (
							<>
								<View style={styles.unknownWrapper}>
									<Text style={styles.unknownText}>?</Text>
								</View>
								<Text style={styles.tokenText}>{strings('network_information.unknown_network')}</Text>
							</>
						) : (
							<>
								<NetworkMainAssetLogo
									style={styles.ethLogo}
								/>
								<Text style={styles.tokenText}>
									{type === RPC ? `${nickname}`: type === MAINNET ? `${type}` : `${strings('network_information.testnet_network', {type})}`}
								</Text>
							</>
						)}
					</View>
					{ticker === PRIVATENETWORK && <Text style={styles.rpcUrl}>{type}</Text>}
				</View>
				<Text style={styles.messageTitle}>{strings('network_information.things_to_keep_in_mind')}:</Text>

				<View style={styles.descriptionViews}>
					<Description
						description={
							type !== RPC ? strings('network_information.first_description', { ticker })
								: [networkTicker === undefined ? strings('network_information.private_network') : strings('network_information.first_description', { ticker })]
						}
						number={1}
						clickableText={undefined}
					/>
					<Description
						description={strings('network_information.second_description')}
						clickableText={strings('network_information.learn_more')}
						number={2}
					/>
					<Description
						description={
							ticker === PRIVATENETWORK
								? strings('network_information.private_network_third_description')
								: strings('network_information.third_description')
						}
						clickableText={strings('network_information.add_token')}
						number={3}
					/>
				</View>
				<StyledButton
					type="confirm"
					onPress={onClose}
					containerStyle={styles.closeButton}
					testID={'close-network-info-button'}
				>
					{strings('network_information.got_it')}
				</StyledButton>
			</View>
		</View>
	);
};

const mapStateToProps = (state: any) => ({
	networkProvider: state.engine.backgroundState.NetworkController.provider,
});

export default connect(mapStateToProps)(NetworkInfo);