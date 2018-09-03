import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { Row, Col } from 'reactstrap';
import { reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import withEditOverlay from 'components/with_edit_overlay';
import FormPanel from 'components/form_panel';
import ContractStatus from 'components/contract_status';
import TwoColView from 'components/two_col_view';
import TwoColField from 'components/two_col_field';
import EditableInput from 'components/editable_input';
import EditableDate from 'components/editable_date';
import { dateNormalizer } from 'validation_normalizers';

interface Props {
  url: string;
  contract: { _status: null | number; [key: string]: any };
  prefix: string;
  register: any;
  contractor: any;
  groupId: string;
  updateContract: Function;
}

const LPCContract = ({
  contract,
  prefix,
  contractor,
  handleSubmit,
  editMode,
  switchEditMode,
  groupId,
  updateContract,
  pristine,
  reset,
  submitting,
  validationRules,
}: Props & InjectedIntlProps) => {
  const submit = params => new Promise((resolve, reject) => {
    updateContract({
      groupId,
      contractId: contract.id,
      resolve,
      reject,
      params,
    });
  }).then(() => {
    Alert.success('Saved!');
    switchEditMode();
  });

  return (
    <div className="contract-data">
      <form onSubmit={handleSubmit(submit)}>
        <FormPanel
          {...{
            editMode,
            dirty: !pristine,
            onCancel: () => {
              reset();
              switchEditMode();
            },
            cancelDisabled: submitting,
            onSave: handleSubmit(submit),
            saveDisabled: pristine || submitting,
          }}
        >
          <Row>
            <Col xs="12">
              <h5 className="grey-underline mt-5 pb-2">
                <FormattedMessage id={`${prefix}.headerContractsDetails`} />
                {!editMode
                  && contract.updatable && (
                    <i
                      data-cy="group edit switch"
                      className="buzzn-pencil"
                      style={{ float: 'right' }}
                      onClick={switchEditMode}
                    />
                )}
              </h5>
              <TwoColField
                {...{
                  prefix,
                  name: 'taxNumber',
                  editMode,
                  validationRules,
                  component: EditableInput,
                }}
              />
              <TwoColView {...{ prefix, field: 'customer' }}>
                {contract.customer.name || `${contract.customer.firstName} ${contract.customer.lastName}`}
              </TwoColView>
              <TwoColView {...{ prefix, field: 'customerNumber' }}>{contract.customer.customerNumber}</TwoColView>
              <TwoColView {...{ prefix, field: 'contractor' }}>
                {contractor.name || `${contractor.firstName} ${contractor.lastName}`}
              </TwoColView>
              <h5 className="grey-underline mt-5 pb-2">
                <FormattedMessage id={`${prefix}.headerDates`} />
              </h5>
              <TwoColView {...{ prefix, field: 'status' }}>
                <FormattedMessage id={`${prefix}.${contract.status}`} />
                <ContractStatus status={contract.status} size="large" />
              </TwoColView>
              <TwoColField
                {...{
                  prefix,
                  name: 'signingDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'beginDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'terminationDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
              <TwoColField
                {...{
                  prefix,
                  name: 'lastDate',
                  editMode,
                  validationRules,
                  component: EditableDate,
                  normalize: dateNormalizer('YYYY-MM-DD'),
                }}
              />
            </Col>
          </Row>
        </FormPanel>
      </form>
    </div>
  );
};

export default injectIntl(withEditOverlay(reduxForm({ form: 'LPCUpdateForm', enableReinitialize: true })(LPCContract)));
