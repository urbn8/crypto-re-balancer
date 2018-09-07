import * as React from "react";
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"

interface IState {
}

export default class BacktestDashboard extends React.Component<any, IState> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <View>
        <VerticalLayout mockup>
          <HorizontalLayout mockup>
            <Panel proportion={2}>Chart</Panel>
            <Panel proportion={1}>Summary</Panel>
          </HorizontalLayout>
          <HorizontalLayout mockup>
            <Panel>Asset Selection</Panel>
            <Panel fixed fixedWidth={200}>Configuration</Panel>
          </HorizontalLayout>
        </VerticalLayout>
      </View>
    )
  }
}