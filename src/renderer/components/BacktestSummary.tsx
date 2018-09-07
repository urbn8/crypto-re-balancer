import * as React from "react";
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import { FormGroup, InputGroup, Card, Elevation, NumericInput, HTMLSelect, Dialog, Navbar, NavbarHeading, NavbarGroup, Alignment, Divider, H2, ButtonGroup, Button, HTMLTable, Tooltip, Position } from "@blueprintjs/core";
import styled from 'styled-components'
import { Asset } from "../../common/Asset";

interface IState {
}

const Clear = styled.div`

`

export default class BacktestSummary extends React.Component<any, IState> {
  constructor(props) {
    super(props);
  }

	render() {
    const data: IPropotion[] = [
      {
        symbol: 'BTC',
        ratio: 0.5,
      },
      {
        symbol: 'ETH',
        ratio: 0.5,
      },
      {
        symbol: 'ETH',
        ratio: 0.5,
      },
      {
        symbol: 'ETH',
        ratio: 0.5,
      },
      {
        symbol: 'ETH',
        ratio: 0.5,
      },
      {
        symbol: 'ETH',
        ratio: 0.5,
      },
      {
        symbol: 'ETH',
        ratio: 0.5,
      },
    ]

    return (
      <Card interactive={false} elevation={Elevation.TWO}>
        <H2>Summary</H2>
        <Divider />

        <AssetsPropotion data={data}/>

        <Report />
      </Card>
    )
  }
}

interface IPropotion {
  symbol: string;
  ratio: number
}

interface IAssetsPropotionProps {
  data: IPropotion[]
}

const AssetsPropotionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

class AssetsPropotion extends React.Component<IAssetsPropotionProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <AssetsPropotionWrapper>
        {
          this.props.data.map((assetPropotion) => (
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

class AssetPropotion extends React.Component<IAssetPropotionProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <Tooltip content={ <span className='bp3-text-small'>{ this.props.data.symbol }</span> } position={ Position.TOP }>
        <AssetPropotionWrapper>
            <PropotionText className='bp3-text-large'>{ Math.round(this.props.data.ratio * 100 * 100) / 100 }%</PropotionText>
            <AssetImg src={ `cryptocurrency-icons/svg/color/${ this.props.data.symbol.toLowerCase() }.svg` }/>
        </AssetPropotionWrapper>
      </Tooltip>
    )
  }
}

class Report extends React.Component<any, IState> {
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