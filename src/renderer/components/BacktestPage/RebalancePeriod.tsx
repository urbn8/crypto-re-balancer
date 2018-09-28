import * as React from "react";
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import { FormGroup, InputGroup, Card, Elevation, NumericInput, HTMLSelect, Dialog, Navbar, NavbarHeading, NavbarGroup, Alignment, Divider, H2 } from "@blueprintjs/core";
import { PeriodUnit } from "./store/store";
import { observer } from "mobx-react";

interface IProps {
  data: {
    rebalancePeriod: number
    rebalancePeriodUnit: PeriodUnit
  }
  onRelalancePeriodChange(rebalancePeriod: number)
  onRelalancePeriodUnitChange(rebalancePeriodUnit: PeriodUnit)
}

@observer
export default class RebalancePeriod extends React.Component<IProps, {}> {
  constructor(props) {
    super(props);
  }

	render() {
    const { data } = this.props

    return (
      <Card interactive={false} elevation={Elevation.TWO}>
        <H2>Rebalance Period</H2>
        <Divider />

        <FormGroup
          // helperText="Number *"
          label="Rebalance every"
          labelFor="period"
          // labelInfo="Number *"
        >
          {/* <NumericInput id='period' value='1'/> */}
          <InputGroup id='period' type='number' placeholder="Placeholder text" value={ data.rebalancePeriod + '' }
            min='1' max='10'
            onChange={ (e) => this.props.onRelalancePeriodChange(parseInt(e.target.value)) }
          />
        </FormGroup>
        <HTMLSelect value={ data.rebalancePeriodUnit } options={[
          {
            value: 'hour', label: 'Hour',
          },
          {
            value: 'day', label: 'Day',
          },
          {
            value: 'week', label: 'Week',
          },
          {
            value: 'never', label: 'Never',
          },
        ]} fill={ true }
        onChange={ (e) => this.props.onRelalancePeriodUnitChange(e.target.value as PeriodUnit) }
        />
      </Card>
    )
  }
}