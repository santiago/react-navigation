/* @flow */

import * as React from 'react';
import { NativeModules } from 'react-native';

import StackViewLayout from './StackViewLayout';
import CardStackStyleInterpolator from '../CardStack/CardStackStyleInterpolator';
import Transitioner from '../Transitioner';
import TransitionConfigs from '../CardStack/TransitionConfigs';

import type {
  NavigationSceneRenderer,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationState,
  NavigationTransitionProps,
  NavigationNavigatorProps,
  NavigationRouter,
  HeaderMode,
  ViewStyleProp,
  TransitionConfig,
} from '../../TypeDefinition';

const NativeAnimatedModule =
  NativeModules && NativeModules.NativeAnimatedModule;

type Props = {} & NavigationNavigatorProps<
  NavigationStackScreenOptions,
  NavigationState
>;

class StackView extends React.Component<Props> {
  _render: NavigationSceneRenderer;

  static defaultProps = {
    navigatorConfigRENAME_ME: {
      mode: 'card',
    },
  };

  render() {
    const { index, isTransitioning, detailsRENAME_ME } = this.props;
    return (
      <Transitioner
        configureTransition={this._configureTransition}
        detailsRENAME_ME={detailsRENAME_ME}
        navigation={this.props.navigation}
        render={this._render}
        onTransitionStart={this.props.onTransitionStart}
        onTransitionEnd={this.props.onTransitionEnd}
      />
    );
  }

  _configureTransition = (
    // props for the new screen
    transitionProps: NavigationTransitionProps,
    // props for the old screen
    prevTransitionProps: ?NavigationTransitionProps
  ) => {
    const isModal = this.props.navigatorConfigRENAME_ME.mode === 'modal';
    // Copy the object so we can assign useNativeDriver below
    // (avoid Flow error, transitionSpec is of type NavigationTransitionSpec).
    const transitionSpec = {
      ...TransitionConfigs.getTransitionConfig(
        this.props.navigatorConfigRENAME_ME.transitionConfig,
        transitionProps,
        prevTransitionProps,
        isModal
      ).transitionSpec,
    };
    if (
      !!NativeAnimatedModule &&
      // Native animation support also depends on the transforms used:
      CardStackStyleInterpolator.canUseNativeDriver()
    ) {
      // Internal undocumented prop
      transitionSpec.useNativeDriver = true;
    }
    return transitionSpec;
  };

  _render = (props: NavigationTransitionProps): React.Node => {
    const { screenProps, navigatorConfigRENAME_ME } = this.props;
    return (
      <StackViewLayout
        {...navigatorConfigRENAME_ME}
        screenProps={screenProps}
        detailsRENAME_ME={this.props.detailsRENAME_ME}
        {...props}
      />
    );
  };
}

export default StackView;
