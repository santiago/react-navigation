import React from 'react';

import SceneView from '../SceneView';

/**
 * Component that renders the child screen of the drawer.
 */
class DrawerScreen extends React.PureComponent {
  render() {
    const { sceneDescriptors, navigation, screenProps } = this.props;
    const { routes, index } = navigation.state;
    const descriptor = sceneDescriptors.find(s => s.key === routes[index].key);
    const Content = descriptor.getComponent();
    return (
      <SceneView
        screenProps={screenProps}
        component={Content}
        navigation={descriptor.navigation}
      />
    );
  }
}

export default DrawerScreen;
