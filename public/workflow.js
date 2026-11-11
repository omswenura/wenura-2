(function(root) {
  const stages = [
    {title:'Collect the sample', description:'Start with the charger you selected.', tasks:[['collect','Collect selected charger sample','Record the model and supplier above.']]},
    {title:'Review the sample', description:'Check the commercial and product details.', tasks:[['appearance','Appearance','Check finish, build quality, ports, and markings.'],['moq','Minimum order quantity (MOQ)','Confirm the supplier’s minimum order quantity.'],['protocols','Charging protocols','Record the supported charging protocols.'],['price','Price & required quantity','Negotiate a good price and confirm the quantity you need.'],['certificate','Certificate','Check the certificate and its relevance to this model.'],['production','Production period','Confirm the lead time with the supplier.']]},
    {title:'Approve & hand over', description:'Only proceed when the sample is acceptable.', tasks:[['approval','Sample approved — hand over to company engineer','Confirm your sample review is acceptable before engineering tests.']]},
    {title:'Engineer verification', description:'Record the engineer’s actual test findings.', tasks:[['wattage','Actual wattage','Measure the charger’s actual output wattage.'],['comparison','Compare specifications with actual wattage','Compare the advertised specification against measured output.'],['temperature','Temperature check','Record the engineer’s temperature test result.'],['engineerProtocols','Protocol verification','Have the engineer verify the charging protocols.']]}
  ];
  const tasks = stages.flatMap(s => s.tasks);
  const isAvailable = (id, checks) => { const i = tasks.findIndex(t => t[0] === id); return i >= 0 && tasks.slice(0,i).every(t => checks[t[0]]); };
  const nextTask = checks => tasks.find(t => !checks[t[0]]) || null;
  const api = {stages,tasks,isAvailable,nextTask};
  if (typeof module !== 'undefined') module.exports = api;
  else root.Workflow = api;
})(typeof window !== 'undefined' ? window : globalThis);
