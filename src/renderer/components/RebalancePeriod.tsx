import * as React from "react";
import { HorizontalLayout,
  VerticalLayout,
  Panel,
  Separator,
  Spacer,
  View } from "nice-react-layout"
import { FormGroup, InputGroup, Card, Elevation, NumericInput, HTMLSelect, Dialog, Navbar, NavbarHeading, NavbarGroup, Alignment, Divider, H2 } from "@blueprintjs/core";

interface IState {
}

export default class RebalancePeriod extends React.Component<any, IState> {
  constructor(props) {
    super(props);
  }

	render() {
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
          <InputGroup id='period' type='number' placeholder="Placeholder text" value='1'/>
        </FormGroup>
        <HTMLSelect value={ 'week' } options={[
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
        ]} fill={ true }/>
      </Card>
    )
  }
}