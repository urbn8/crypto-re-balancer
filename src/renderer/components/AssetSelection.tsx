import * as React from "react";
import { Button, Card, Elevation, H2, H4, Divider, Spinner } from "@blueprintjs/core"
import { Symbol } from 'binance-api-node';
import styled from 'styled-components'
import Scrollbars from 'react-custom-scrollbars'

import { Asset as IAsset } from "../../common/Asset";

interface IProps {
  assets?: IAsset[]
}

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
          !this.props.assets ? (
            <Spinner size={Spinner.SIZE_STANDARD} />
          ) :
          <Scrollbars>
            {
              this.props.assets.map((asset) => (
                <Asset key={ asset.symbol } name={ asset.name } symbol={ asset.symbol } selected={ false }/>
              ))
            }
          </Scrollbars>
        }

        {
          
        }
      </Card>
    )
  }
}

interface IAssetProps extends React.Props<Asset> {
  name: string
  symbol: string
  selected: boolean
}

const AssetWrapper = styled.div`
  float: left;
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

class Asset extends React.Component<IAssetProps, {hover: boolean}> {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    }
  }

  mouseOut() {
    console.log("Mouse out!!!");
    this.setState({hover: false});
  }
  
  mouseOver() {
    console.log("Mouse over!!!");
    this.setState({hover: true});
  }

  render() {
    const {name, symbol} = this.props

    return (
      <AssetWrapper onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>
        <Card interactive={true} elevation={Elevation.TWO}>
          <AssetImg src={ `cryptocurrency-icons/svg/${ this.state.hover ? 'color' : 'white' }/${ symbol.toLowerCase() }.svg` }/>
          <AssetName>{ name }</AssetName>
        </Card>
      </AssetWrapper>
    )
  }
}
