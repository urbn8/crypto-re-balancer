import * as React from "react";
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import { Symbol } from 'binance-api-node';
import styled from 'styled-components'

import AssetSelection from "./AssetSelection";
import { Asset } from "../../common/Asset";
import RebalancePeriod from "./RebalancePeriod";
import BacktestSummary from "./BacktestSummary";
import BacktestChart from "./BacktestChart";

export interface IProps {
  assets: Asset[]
}

interface IState {
}

const PanelInnerWrapper = styled.div`
  padding: 5px;
  height: 100%;
`

export default class BacktestDashboard extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      // <View>
        <VerticalLayout>
          <HorizontalLayout>
            <Panel proportion={2}>
              <PanelInnerWrapper>
                <BacktestChart />
              </PanelInnerWrapper>
            </Panel>
            <Panel proportion={1}>
              <PanelInnerWrapper>
                <BacktestSummary />
              </PanelInnerWrapper>
            </Panel>
          </HorizontalLayout>
          <HorizontalLayout>
            <Panel>
              <PanelInnerWrapper>
                <AssetSelection assets={ this.props.assets }/>
              </PanelInnerWrapper>
            </Panel>
            <Panel fixed fixedWidth={280}>
              <PanelInnerWrapper>
                <RebalancePeriod />
              </PanelInnerWrapper>
            </Panel>
          </HorizontalLayout>
        </VerticalLayout>
      // </View>
    )
  }
}