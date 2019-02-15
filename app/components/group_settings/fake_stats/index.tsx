import React, { useState } from 'react';
import Alert from 'react-s-alert';

const FakeStats = ({ group, updateGroup }) => {
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
  ]
  const fields = ratios.concat([
    'co2EmissionGrammPerKwh',
    'nuclearWasteMiligrammPerKwh',
    'renterPowerEeg',
    'selfSufficiencyReport',
    'utilizationReport',
    'gasReport',
    'sunReport',
    'electricitySupplier',
    'tech',
  ]);

  const handleSave = () => new Promise((resolve, reject) => {
    if (fields.find(f => !fakeStats[f])) reject('Please fill all values');
    if (fields.filter(f => !['electricitySupplier', 'tech'].includes(f)).find(f => isNaN(fakeStats[f]))) reject('Only numbers');
    if (ratios.reduce((sum, key) => (sum + parseFloat(fakeStats[key])), 0) !== 100) reject('Sum of ratios should be 100');
    updateGroup({
      groupId: group.id,
      resolve,
      reject,
      params: { fakeStats: JSON.stringify(fakeStats), updatedAt: group.updatedAt },
    });
  }).then((res) => {
    // @ts-ignore
    Alert.success(JSON.stringify(res.fake_stats));
    setEditMode(false);
  }).catch(e => Alert.error(e));

  return (
    <div>
      {fields.map(fieldName => (
        <div key={fieldName}>
          <input
            disabled={!editMode}
            type="text"
            value={fakeStats[fieldName] || ''}
            onChange={({ target: { value } }) => setFakeStats({ ...fakeStats, [fieldName]: value })}
          />
          <label>{fieldName}</label>
        </div>
      ))}
      {editMode ? (
        <React.Fragment>
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </React.Fragment>
      ) : (
        <button onClick={() => setEditMode(true)}>Edit</button>
      )}
    </div>
  );
};

export default FakeStats;
