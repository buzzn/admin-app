import * as React from 'react';
import pick from 'lodash/pick';
import Form from './form';
import Switches from './switches';

interface Props {
  editMode: boolean;
  switchEditMode: () => void;
  handleSubmit: Function;
  group: { [key: string]: any };
  deleteGroup: Function;
  updateGroup: Function;
  address: { [key: string]: any };
  transmissionSystemOperator: { [key: string]: any };
  distributionSystemOperator: { [key: string]: any };
  electricitySupplier: { [key: string]: any };
  validationRules: any;
}

const Group = ({
  validationRules,
  updateGroup,
  group,
  deleteGroup,
  address,
  transmissionSystemOperator,
  distributionSystemOperator,
  electricitySupplier,
}: Props) => (
  <React.Fragment>
    <Form
      {...{
        validationRules,
        updateGroup,
        initialValues: group,
        group,
        deleteGroup,
        address,
        transmissionSystemOperator,
        distributionSystemOperator,
        electricitySupplier,
      }}
    />
    <Switches
      {...{
        updateGroup,
        initialValues: pick(group, [
          'showObject',
          'showProduction',
          'showEnergy',
          'showContact',
          'showDisplayApp',
          'updatedAt',
        ]),
        group,
      }}
    />
  </React.Fragment>
);

export default Group;
