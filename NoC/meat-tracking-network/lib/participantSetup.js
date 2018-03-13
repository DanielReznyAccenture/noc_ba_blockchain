/**
 *
 * @param {org.accenture.com.participant.SetupParticipants} SetupParticipants
 * @transaction
 */
function SetupParcipiants(SetupParticipants) {
    var factory = getFactory();
    var NS = 'org.accenture.com.asset';
    var NSP = 'org.accenture.com.participant';

    var farmers = [
        factory.newResource(NSP, 'Farmer', 'Farmer_1'),
        factory.newResource(NSP, 'Farmer', 'Farmer_2'),
        factory.newResource(NSP, 'Farmer', 'Farmer_3'),
        factory.newResource(NSP, 'Farmer', 'Farmer_4'),
    ];

    var butchers = [
        factory.newResource(NSP, 'Butchery', 'Butchery_1'),
        factory.newResource(NSP, 'Butchery', 'Butchery_2')
    ];
    return getParticipantRegistry(NSP + '.Regulator')
        .then(function (regulatorRegistry) {
            var regulator = factory.newResource(NSP, 'Regulator', 'REGULATOR');
            regulator.authority = 'MEATAUTHORITY'
            regulator.email = 'xyz.gov.com'
            regulator.firstName ='Ronnie'
            regulator.lastName='Regulator'
            return regulatorRegistry.addAll([regulator]);
        })
        .then(function () {
            return getParticipantRegistry(NSP + '.Farmer');
        })
        .then(function (farmerRegistry) {
            i = 1
            farmers.forEach(function (farmer) {
               farmer.businessId = 'Farmer_'+i
               farmer.email = 'ID#'+i+'.com'
                farmer.firstName = farmer.getIdentifier();
                farmer.lastName = '';
                farmer.address1 = 'Address1';
                farmer.address2 = 'Address2';
                farmer.county = 'County';
                farmer.postcode = 'PO57C0D3';
                i++
            });
            return farmerRegistry.addAll(farmers);
        })
        .then(function () {
            return getParticipantRegistry(NSP + '.Butchery');
        })
        .then(function(butcheryRegistry) {
            i = 1
            butchers.forEach(function(butchery) {
                butchery.businessId = 'Butchery_'+i
                butchery.Name = butchery.getIdentifier();
                butchery.address1 = 'Address '+butchery.getIdentifier();
                butchery.address2 = 'Address2';
                butchery.county = 'County';
                butchery.postcode = '11150';
                butchery.email = butchery.getIdentifier()+'@'+butchery.getIdentifier()+'.com'
                i++
            
            });
            return butcheryRegistry.addAll(butchers);
        });
}