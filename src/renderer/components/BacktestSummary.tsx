import * as React from "react";
import * as path from 'path'
import { observer } from "mobx-react"
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import { FormGroup, InputGroup, Card, Elevation, NumericInput, HTMLSelect, Dialog, Navbar, NavbarHeading, NavbarGroup, Alignment, Divider, H2, ButtonGroup, Button, HTMLTable, Tooltip, Position, MultiSlider, HandleInteractionKind, Intent } from "@blueprintjs/core";
import styled from 'styled-components'
import { Asset } from "../../common/Asset";
import { IBacktestAsset, IPropotion } from "./BacktestDashboardContainer";

declare const __static : string

interface IData {
  propotions: IPropotion[]
}

interface IProps {
  data: IData
  setPropotionRatios: (values: number[]) => void
}

@observer
export default class BacktestSummary extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    

    return (
      <Card interactive={false} elevation={Elevation.TWO} style={{
        // height: '100%'
      }}>
        <H2>Summary</H2>
        <Divider />

        <AssetsPropotion data={this.props.data}/>

        <PropotionSlider data={this.props.data} setPropotionRatios={ this.props.setPropotionRatios }/>

        <Report />
      </Card>
    )
  }
}

@observer
class PropotionSlider extends React.Component<IProps, {
  propotions: IPropotion[]
}> {
  constructor(props) {
    super(props);

    this.state = {
      propotions: this.props.data.propotions,
    }
  }

  handleChange = (rawValues: number[]) => {
    this.props.setPropotionRatios(rawValues)
  }

	render() {
    // const values = {
    //   dangerStart: 12,
    //   warningStart: 36,
    //   warningEnd: 72,
    //   dangerEnd: 90,
    // }
    // const values = {
    //   firstStart: 33.33,
    //   secondStart: 66.66,
    //   // thirdStart: 99.99,
    // }

    let stepSum = 0

    return (
      <MultiSlider
        defaultTrackIntent={Intent.SUCCESS}
        labelStepSize={20}
        max={100}
        min={0}
        onChange={this.handleChange}
        showTrackFill={false}
        stepSize={2}
      >
        {
          this.state.propotions.map((propotion, i) => {
            if (i === this.state.propotions.length - 1) {
              return undefined
            }

            const percent = propotion.ratio * 100
            stepSum += percent
            const value = stepSum

            return <MultiSlider.Handle
              key={ propotion.symbol }
              type="start"
              value={ value }
              intentBefore="danger"
              interactionKind={HandleInteractionKind.PUSH}
            />
          })
        }
        {/* <MultiSlider.Handle
          type="start"
          value={values.firstStart}
          intentBefore="danger"
          interactionKind={HandleInteractionKind.PUSH}
        />
        <MultiSlider.Handle
          type="start"
          value={values.secondStart}
          intentBefore="warning"
          interactionKind={HandleInteractionKind.PUSH}
        /> */}
        {/* <MultiSlider.Handle
          type="start"
          value={values.thirdStart}
          intentAfter="warning"
          interactionKind={HandleInteractionKind.PUSH}
        /> */}
        {/* <MultiSlider.Handle
          type="end"
          value={values.dangerEnd}
          intentAfter="danger"
          interactionKind={HandleInteractionKind.PUSH}
        /> */}
      </MultiSlider>
    )
  }
}

interface IAssetsPropotionProps {
  data: IData
}

const AssetsPropotionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

@observer
class AssetsPropotion extends React.Component<IAssetsPropotionProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <AssetsPropotionWrapper>
        {
          this.props.data.propotions.map((assetPropotion) => (
            <AssetPropotion key={ assetPropotion.symbol } data={ assetPropotion }/>
          ))
        }
      </AssetsPropotionWrapper>
    )
  }
}

interface IAssetPropotionProps {
  data: IPropotion
}

const AssetPropotionWrapper = styled.span`
  width: 85px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`

const AssetImg = styled.img`
  font-size: 20px;
  fill: #fff;
`

const PropotionText = styled.span`
`

@observer
class AssetPropotion extends React.Component<IAssetPropotionProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <Tooltip content={ <span className='bp3-text-small'>{ this.props.data.symbol }</span> } position={ Position.TOP_LEFT }>
        <AssetPropotionWrapper>
            <PropotionText className='bp3-text-large'>{ Math.round(this.props.data.ratio * 100 * 100) / 100 }%</PropotionText>
            {/* <AssetImg src={ require(path.join(__static, `cryptocurrency-icons/svg/color/${ this.props.data.symbol.toLowerCase() }.svg`)) }/> */}
            <AssetImg src={ `file:///${ __static }/cryptocurrency-icons/svg/color/${ this.props.data.symbol.toLowerCase() }.svg` }/>
        </AssetPropotionWrapper>
      </Tooltip>
    )
  }
}

class Report extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <HTMLTable className='bp3-interactive' bordered={ true } style={{width: '100%'}}>
        <tbody className='bp3-text-large'>
          <tr>
            <td>Rebalancing Final:</td>
            <td>$92,416 (1,848%)</td>
          </tr>
          <tr>
            <td>Holding Final:</td>
            <td>$92,416 (1,848%)</td>
          </tr>
          <tr>
            <td>Initial Investment:</td>
            <td>$92,416 (1,848%)</td>
          </tr>
          <tr>
            <td>Rebalanced:</td>
            <td>$92,416 (1,848%)</td>
          </tr>
          <tr>
            <td>Trading Fee:</td>
            <td>$92,416 (1,848%)</td>
          </tr>
        </tbody>
      </HTMLTable>
    )
  }
}