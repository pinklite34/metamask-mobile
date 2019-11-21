import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { colors, fontStyles } from '../../../../styles/common';
import PropTypes from 'prop-types';
import Identicon from '../../../UI/Identicon';
import { connect } from 'react-redux';
import { renderShortAddress } from '../../../../util/address';
import Networks from '../../../../util/networks';

const styles = StyleSheet.create({
	root: {
		backgroundColor: colors.white
	},
	addressElementWrapper: {
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: colors.grey050
	},
	addressElementInformation: {
		flexDirection: 'column'
	},
	addressIdenticon: {
		paddingRight: 16
	},
	addressTextNickname: {
		...fontStyles.normal,
		fontSize: 14,
		width: '90%'
	},
	addressTextAddress: {
		...fontStyles.normal,
		fontSize: 12,
		color: colors.grey500
	},
	myAccountsText: {
		...fontStyles.normal,
		color: colors.blue,
		fontSize: 16
	},
	myAccountsWrapper: {},
	myAccountsTouchable: {
		borderBottomWidth: 1,
		borderBottomColor: colors.grey050,
		padding: 16
	},
	labelElementWrapper: {
		backgroundColor: colors.grey000,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: colors.grey050,
		padding: 8
	},
	labelElementText: {
		...fontStyles.normal,
		fontSize: 12,
		marginHorizontal: 8,
		color: colors.grey600
	}
});

const AddressElement = (address, nickname) => (
	<View key={address} style={styles.addressElementWrapper}>
		<View style={styles.addressIdenticon}>
			<Identicon address={address} diameter={28} />
		</View>
		<View style={styles.addressElementInformation}>
			<Text style={styles.addressTextNickname} numberOfLines={1}>
				{nickname}
			</Text>
			<Text style={styles.addressTextAddress} numberOfLines={1}>
				{renderShortAddress(address)}
			</Text>
		</View>
	</View>
);

const LabelElement = label => (
	<View style={styles.labelElementWrapper}>
		<Text style={styles.labelElementText}>{label}</Text>
	</View>
);

/**
 * View that wraps the wraps the "Send" screen
 */
class AddressList extends PureComponent {
	static propTypes = {
		/**
		 * List of accounts from the PreferencesController
		 */
		identities: PropTypes.object,
		/**
		 * Map representing the address book
		 */
		addressBook: PropTypes.object,
		/**
		 * A string representing the network name
		 */
		providerType: PropTypes.string
	};

	state = {
		myAccountsOpened: false
	};

	openMyAccounts = () => {
		this.setState({ myAccountsOpened: true });
	};

	render = () => {
		const { identities, addressBook, providerType } = this.props;
		const { myAccountsOpened } = this.state;
		const networkAddressBook = addressBook[Networks[providerType].networkId] || {};
		return (
			<View style={styles.root}>
				<View style={styles.myAccountsWrapper}>
					{!myAccountsOpened ? (
						<TouchableOpacity style={styles.myAccountsTouchable} onPress={this.openMyAccounts}>
							<Text style={styles.myAccountsText}>Transfer between my accounts</Text>
						</TouchableOpacity>
					) : (
						Object.keys(identities).map(address => AddressElement(address, identities[address].name))
					)}
				</View>
				{LabelElement('Recents')}
				{Object.keys(networkAddressBook).map(address =>
					AddressElement(address, networkAddressBook[address].name)
				)}
			</View>
		);
	};
}

const mapStateToProps = state => ({
	addressBook: state.engine.backgroundState.AddressBookController.addressBook,
	identities: state.engine.backgroundState.PreferencesController.identities,
	providerType: state.engine.backgroundState.NetworkController.provider.type
});

export default connect(mapStateToProps)(AddressList);