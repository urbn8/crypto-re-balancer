import * as React from "react";
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import { Symbol } from 'binance-api-node';
import AssetSelection from "./AssetSelection";
import { Asset } from "../../common/Asset";
import RebalancePeriod from "./RebalancePeriod";
import BacktestSummary from "./BacktestSummary";

export interface IProps {
  assets: Asset[]
}

interface IState {
}

export default class BacktestDashboard extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      // <View>
        <VerticalLayout mockup>
          <HorizontalLayout mockup>
            <Panel proportion={2}>Chart</Panel>
            <Panel proportion={1}>
              <BacktestSummary />
            </Panel>
          </HorizontalLayout>
          <HorizontalLayout>
            <Panel customCss={{
              overflow: 'auto',
            }}>
              <AssetSelection assets={ this.props.assets }/>
            </Panel>
            <Panel fixed fixedWidth={280}>
              <RebalancePeriod />
            </Panel>
          </HorizontalLayout>
        </VerticalLayout>
      // </View>
    )
  }
}