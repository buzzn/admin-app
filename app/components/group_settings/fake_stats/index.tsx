import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { FormGroup, Input, Row, Col } from 'reactstrap';
import Dropzone from 'react-dropzone';

const FakeStats = ({ group, updateGroup, addReadings, readingsResponse, getAnnualReadingsTable }) => {
  const [editMode, setEditMode] = useState(false);
  const [fakeStats, setFakeStats] = useState({});
  if (!Object.keys(fakeStats).length && group.fakeStats && Object.keys(group.fakeStats).length) setFakeStats(group.fakeStats);
  const ratios = [
    'nuclearRatio',
    'coalRatio',
    'gasRatio',
    'otherFossilesRatio',
    'renewablesEegRatio',
    'otherRenewablesRatio',
    'renterPowerEeg',
  ];

  const fields = ratios.concat([
    'co2EmissionGrammPerKwh',
    'nuclearWasteMiligrammPerKwh',
    'selfSufficiencyReport',
    'utilizationReport',
    'gasReport',
    'sunReport',
    'waterReport',
    'windReport',
    'electricitySupplier',
    'tech',
  ]);

  const handleSave = () => new Promise((resolve, reject) => {
    if (fields.find(f => !fakeStats[f])) {
      reject('Please fill all values');
      return;
    }
    if (fields.filter(f => !['electricitySupplier', 'tech'].includes(f)).find(f => isNaN(fakeStats[f]))) {
      reject('Only numbers');
      return;
    }
    var sum_ratios = parseInt(ratios.reduce((sum, key) => sum + parseFloat(fakeStats[key]), 0).toFixed(0));
    if (sum_ratios !== 100) {
      reject('Sum of ratios should be 100, but was ' + sum_ratios);
      return;
    }
    updateGroup({
      groupId: group.id,
      resolve,
      reject,
      params: { fakeStats: JSON.stringify(fakeStats), updatedAt: group.updatedAt },
    });
  })
    .then((res) => {
      // @ts-ignore
      Alert.success(JSON.stringify(res.fake_stats));
      setEditMode(false);
    })
    .catch(e => Alert.error(e));

  const handleFileUpload = async(files) => {
    const params = new FormData();
    params.append('file', files[0]);
    const groupId = group.id;
    const res =  await new Promise((resolve, reject) => addReadings({
      groupId,
      params,
      resolve,
      reject,
    }));

    if (res) {
      Alert.error(JSON.stringify(res));
    } else {
      Alert.success('Document attached');
    }
  };

  const handleDownload = async () => {
    const groupId = group.id;
    const res = await new Promise((resolve, reject) => getAnnualReadingsTable({
      groupId,
      resolve,
      reject,
    }));

    if (res) {
      Alert.error(JSON.stringify(res));
    } else {
      Alert.success('Document successfully generated');
    }
  }

  return (
    <div>
      <Row>
        {fields.map((fieldName,i) => (
          <Col xs={3} key={i}>
            <FormGroup key={fieldName}>
              <Input
                disabled={!editMode}
                type="text"
                value={fakeStats[fieldName] || ''}
                onChange={({ target: { value } }) => setFakeStats({ ...fakeStats, [fieldName]: value })}
              />
              <label>{fieldName}</label>
            </FormGroup>
          </Col>
        ))}
      </Row>
      {editMode ? (
        <React.Fragment>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          <button
            className="btn btn-link"
            onClick={() => {
              setEditMode(false);
              setFakeStats(group.fakeStats || {});
            }}
          >
            Cancel
          </button>
        </React.Fragment>
      ) : (
        <button className="btn btn-primary" onClick={() => setEditMode(true)}>
            Edit
        </button>
        )}
      <button className="btn btn-primary" onClick={() => handleDownload()} style={{marginLeft: 15 + 'px'}}>
          Download
      </button>
      <br />
      <ul>
        {readingsResponse.errors.map((error, i) => <li key={i}>{error}</li>)}
      </ul>
      <br />
      <Dropzone
        {...{
          multiple: false,
          accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          name: 'file',
          onDropRejected: () => {
            Alert.error('Only spreadsheets allowed');
          },
          onDropAccepted: handleFileUpload,
        }}
      />
    </div>
  );
};

export default FakeStats;
