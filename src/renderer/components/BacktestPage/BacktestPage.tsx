import * as ipc from 'electron-better-ipc';
import { HorizontalLayout, Panel, VerticalLayout } from "nice-react-layout";
import * as React from "react";
import styled from 'styled-components';
import AssetSelection from "./AssetSelection";
import BacktestChart from "./BacktestChart";
import BacktestSummary from "./BacktestSummary";
import RebalancePeriod from "./RebalancePeriod";
import Store, { IBacktestAsset, IStore } from './store/store';


type symbolStatus = 'PRE_TRADING' | 'TRADING' | 'POST_TRADING' | 'END_OF_DAY' | 'HALT' | 'AUCTION_MATCH' | 'BREAK'

const PanelInnerWrapper = styled.div`
  padding: 5px;
  height: 100%;
`

export default class BacktestPage extends React.Component<{}, {}> {
  private store: IStore

  constructor(props) {
    super(props);

    this.store = Store()
  }

  async componentDidMount() {
    
    const assets: IBacktestAsset[] = await ipc.callMain('assets');
    console.log('assets: ', assets)

    this.store.actions.setAssets(assets.map((asset) => ({...asset, selected: false})))
    this.store.actions.toggleAssetSelection('BTC')
    this.store.actions.toggleAssetSelection('ETH')
    this.store.actions.toggleAssetSelection('BNB')
  }

	render() {

    const { state, actions } = this.store
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
                <BacktestSummary data={ state } setPropotionRatios={ actions.setPropotionRatios }/>
              </PanelInnerWrapper>
            </Panel>
          </HorizontalLayout>
          <HorizontalLayout>
            <Panel>
              <PanelInnerWrapper>
                <AssetSelection data={ state } toggleAssetSelection={ actions.toggleAssetSelection }/>
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