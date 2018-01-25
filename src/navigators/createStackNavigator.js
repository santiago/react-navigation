/* @flow */

import * as React from 'react';
import createNavigationContainer from '../createNavigationContainer';
import createNavigator2 from './createNavigator2';
import StackView from '../views/StackView/StackView';
import StackRouter from '../routers/StackRouter';
import NavigatorTypes from './NavigatorTypes';

import type {
  NavigationRouteConfigMap,
  StackNavigatorConfig,
  NavigationState,
  NavigationStackScreenOptions,
  NavigationNavigatorProps,
} from '../TypeDefinition';

// A stack navigators props are the intersection between
// the base navigator props (navgiation, screenProps, etc)
// and the view's props
type StackNavigatorProps = NavigationNavigatorProps<
  NavigationStackScreenOptions,
  NavigationState
> &
  React.ElementProps<typeof CardStackTransitioner>;

export default (
  routeConfigMap: NavigationRouteConfigMap,
  stackConfig: StackNavigatorConfig = {}
) => {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);

  // Create a navigator with StackView as the view
  const Navigator = createNavigator2(StackView, router, stackConfig);
  return createNavigationContainer(Navigator);
};
