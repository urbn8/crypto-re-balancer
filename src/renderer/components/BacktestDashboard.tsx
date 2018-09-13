import * as React from "react";
import { observer } from "mobx-react"
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import styled from 'styled-components'

import AssetSelection from "./AssetSelection";
import RebalancePeriod from "./RebalancePeriod";
import BacktestSummary from "./BacktestSummary";
import BacktestChart from "./BacktestChart";
import { StoreActions, State } from "./BacktestDashboardContainer";

interface IProps {
  data: State
  actions: StoreActions
}

const PanelInnerWrapper = styled.div`
  padding: 5px;
  height: 100%;
`

@observer
export default class BacktestDashboard extends React.Component<IProps, {}> {
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
                <BacktestSummary data={ this.props.data } setPropotionRatios={ this.props.actions.setPropotionRatios }/>
              </PanelInnerWrapper>
            </Panel>
          </HorizontalLayout>
          <HorizontalLayout>
            <Panel>
              <PanelInnerWrapper>
                <AssetSelection data={ this.props.data } toggleAssetSelection={ this.props.actions.toggleAssetSelection }/>
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