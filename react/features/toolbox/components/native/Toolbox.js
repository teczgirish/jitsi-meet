// @flow

import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { getRoomName } from '../../../base/conference';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { ChatButton } from '../../../chat';
import { isToolboxVisible } from '../../functions';
import AudioMuteButton from '../AudioMuteButton';
import HangupButton from '../HangupButton';
import VideoMuteButton from '../VideoMuteButton';
import { getCurrentConference } from '../../../base/conference';

import OverflowMenuButton from './OverflowMenuButton';
import styles from './styles';

/**
 * The type of {@link Toolbox}'s React {@code Component} props.
 */
type Props = {

    /**
     * The name of the current conference. Used as part of inviting users.
     */
    _roomName: string,

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType,

    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implements the conference toolbox on React Native.
 */
class Toolbox extends PureComponent<Props> {


    constructor(props: Props) {
        super(props);
        this.state = {
            startRecording: false,
            startDemo: false,
        }
        this._startRecording = this._startRecording.bind(this)
        this._startDemo = this._startDemo.bind(this)
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Container
                style = { styles.toolbox }
                visible = { this.props._visible }>
                {
                    this.state.startRecording ? this._renderToolbar() : this._initialRenderButton()
                }

            </Container>
        );
    }

    /**
     * Constructs the toggled style of the chat button. This cannot be done by
     * simple style inheritance due to the size calculation done in this
     * component.
     *
     * @param {Object} baseStyle - The base style that was originally
     * calculated.
     * @returns {Object | Array}
     */
    _getChatButtonToggledStyle(baseStyle) {
        const { _styles } = this.props;

        if (Array.isArray(baseStyle.style)) {
            return {
                ...baseStyle,
                style: [
                    ...baseStyle.style,
                    _styles.chatButtonOverride.toggled
                ]
            };
        }

        return {
            ...baseStyle,
            style: [
                baseStyle.style,
                _styles.chatButtonOverride.toggled
            ]
        };
    }

    _startRecording() {
        this.setState({
            startDemo: false,
            startRecording: true,
        })
    }

    _startDemo() {
        fetch(`https://api.myntra.com/matrix/live/${'5f7c929a700b671d7867927c'}/record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'START',
            })
        }).then((response) => console.log('testinggirish', response))
        .catch((error) => {
            console.log('testinggirish-err', response);
        });
    }

    /**
     *  Renders the initial button for demo and start live screen
     * The Demo will do nothing but shows the live screen ux as such
     * Start live screen button will
     */
    _initialRenderButton() {
        const { _styles } = this.props;
        const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;
        return (<View
            accessibilityRole = 'toolbar'
            pointerEvents = 'box-none'
            style = { styles.toolbarBeforeLive }
        >
            <Text
                style={{
                    textAlign: 'center', textAlignVertical: 'center',
                    backgroundColor: '#ff3f6c', width: 162, height: 40, alignItems: 'center',
                    fontSize: 14, fontWeight: "600", fontStyle: "normal",
                    lineHeight: 20, borderRadius: 4,
                    color: "#ffffff"
                }}
                onPress={ this._startDemo }
            >
                Start Demo
            </Text>
            <Text
                style={{
                    textAlign: 'center', textAlignVertical: 'center',
                    backgroundColor: '#ff3f6c', width: 162, height: 40, alignItems: 'center',
                    fontSize: 14, fontWeight: "600", fontStyle: "normal",
                    lineHeight: 20, borderRadius: 4,
                    color: "#ffffff"
                }}
                title="Start Live Session"
                onPress={ this._startRecording }
            >
                Start Live Session
            </Text>

        </View>)

    }

    /**
     * Renders the toolbar. In order to avoid a weird visual effect in which the
     * toolbar is (visually) rendered and then visibly changes its size, it is
     * rendered only after we've figured out the width available to the toolbar.
     *
     * @returns {React$Node}
     */
    _renderToolbar() {
        const { _styles } = this.props;
        const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;

        return (
            <View
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'
                style = { styles.toolbar }>
                {/* <ChatButton
                    styles = { buttonStylesBorderless }
                    toggledStyles = { this._getChatButtonToggledStyle(toggledButtonStyles) } /> */}
                <AudioMuteButton
                    styles = { buttonStyles }
                    toggledStyles = { toggledButtonStyles } />
                <HangupButton
                    styles = { hangupButtonStyles } />
                <VideoMuteButton
                    styles = { buttonStyles }
                    toggledStyles = { toggledButtonStyles } />
                {/* <OverflowMenuButton
                    styles = { buttonStylesBorderless }
                    toggledStyles = { toggledButtonStyles } /> */}
            </View>
        );
    }
}

/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: Object): Object {
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state),
        _roomName: getRoomName(state)
    };
}

export default connect(_mapStateToProps)(Toolbox);
