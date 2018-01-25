/*
 * @flow
 */

import React from 'react';

import addNavigationHelpers from '../addNavigationHelpers';

function createNavigator2(NavigationView, router, navigatorConfigRENAME_ME) {
  class Navigator extends React.Component {
    static router = router;
    static navigationOptions = null;

    render() {
      const { navigation, screenProps } = this.props;
      const { dispatch, state } = navigation;
      const { routes, index, isTransitioning } = state;

      const detailsRENAME_ME = routes.map(route => {
        const getComponent = () =>
          router.getComponentForRouteName(route.routeName);
        // const childNavigation = router.getChildNavigation(navigation, route.key);

        const childNavigation = addNavigationHelpers({
          dispatch,
          state: route,
        });
        const options = router.getScreenOptions(childNavigation, screenProps);
        return {
          getComponent,
          options,
          state: route,
          navigation: childNavigation,
        };
      });

      return (
        <NavigationView
          navigation={navigation}
          navigatorConfigRENAME_ME={navigatorConfigRENAME_ME}
          detailsRENAME_ME={detailsRENAME_ME}
          index={index}
          isTransitioning={isTransitioning}
        />
      );
    }
  }
  return Navigator;
}

export default createNavigator2;
