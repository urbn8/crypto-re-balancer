import * as React from "react";
import * as path from 'path'
import { observer } from "mobx-react"
import { Button, Card, Elevation, H2, H4, Divider, Spinner } from "@blueprintjs/core"
import { Symbol } from 'binance-api-node';
import styled from 'styled-components'
import Scrollbars from 'react-custom-scrollbars'
import { IBacktestAsset } from "./store/store";

declare const __static : string

interface IProps {
  data: {
    assets: IBacktestAsset[]
  }
  toggleAssetSelection: (symbol: string) => void
}

const AssetsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

@observer
export default class AssetSelection extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    return (
      <Card interactive={false} elevation={Elevation.TWO} style={{
        height: '100%',
      }}>
        <H2>Asset Selection</H2>
        <Divider />
        
        {
          this.props.data.assets.length === 0 ? (
            <Spinner size={Spinner.SIZE_STANDARD} />
          ) :
          <Scrollbars>
            <AssetsWrapper>
              {
                this.props.data.assets.map((asset) => (
                  <Asset key={ asset.symbol } data={asset} onClick={ () => this.props.toggleAssetSelection(asset.symbol) }/>
                ))
              }
            </AssetsWrapper>
          </Scrollbars>
        }

        {
          
        }
      </Card>
    )
  }
}

interface IAssetProps extends React.Props<Asset> {
  data: IBacktestAsset
  onClick: () => void
}

const AssetWrapper = styled.div`
  width: 130px;
  height: 90px;
  margin: 4px 8px 24px 2px;
  text-align: center;
`

const AssetImg = styled.img`
  font-size: 20px;
  fill: #fff;
`

const AssetName = styled.div`
  font-size: 20px;
  margin-top: 10px;
`

@observer
class Asset extends React.Component<IAssetProps, {hover: boolean}> {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    }
  }

  mouseOut() {
    this.setState({hover: false});
  }
  
  mouseOver() {
    this.setState({hover: true});
  }

  render() {
    const {name, symbol, selected} = this.props.data
    return (
      <AssetWrapper
        // onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}
        onClick={ this.props.onClick }
      >
        <Card interactive={true} elevation={Elevation.TWO}>
          {/* <AssetImg src={ require(path.join(__static, `cryptocurrency-icons/svg/${ selected ? 'color' : 'white' }/${ symbol.toLowerCase() }.svg`)) }/> */}
          {/* <AssetImg src={ `cryptocurrency-icons/svg/${ selected ? 'color' : 'white' }/${ symbol.toLowerCase() }.svg` }/> */}
          <AssetImg src={ `file:///${ __static }/cryptocurrency-icons/svg/${ selected ? 'color' : 'white' }/${ symbol.toLowerCase() }.svg` }/>
          <AssetName>{ name }</AssetName>
        </Card>
      </AssetWrapper>
    )
  }
}
