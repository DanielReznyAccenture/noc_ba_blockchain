
var factory = getFactory();
var NS = 'org.accenture.com.asset';
var NSP = 'org.accenture.com.participant';

function populateFactory(tempAsset) {

    for (var i = 1; i <= tempAsset.pop; i++) {
        tempAsset.container[i] = factory.newResource(NS, tempAsset.name, tempAsset.name + "_" +i)
    }
}

/**
 *
 * @param {org.accenture.com.asset.SetupAssets} SetupAssets
 * @transaction
 */
function SetupAssets(SetupAssets) {
    var animalAsset = { container: animals = [], name: 'Animal', pop: 8 }
    var fieldAsset = { container: fields = [], name: 'Field', pop: 4 }

    populateFactory(animalAsset)
    populateFactory(fieldAsset)


    var animalProperty = factory.newConcept(NS,"AnimalProperty");
            animalProperty.species = 'BEEF';
            animalProperty.movementStatus = 'IN_FIELD';
            animalProperty.weight = 100;
            animalProperty.dateOfBirth = '2018-01-01T10:00:00'

    return getAssetRegistry(NS + '.Field')
        .then(function (fieldRegistry) {
            fields.forEach(function (field, index) {
                field.name = 'Field_' + (index);
            });
            return fieldRegistry.addAll(fieldAsset.container);
        })
        .then(function () {
            return getAssetRegistry(NS + '.Animal');
        })
        .then(function (animalRegistry) {
            console.log(animals)
            animals.forEach(function (animal, index) {
                field = 'Field_' + ((index % 2));
                owner = 'Farmer_' + ((index % 4) + 1);
                animal.location = factory.newRelationship(NS, 'Field', field);
                animal.origin = factory.newRelationship(NS, 'Field', field);
                animal.animalProperty = animalProperty
                animal.owner = factory.newRelationship(NSP, 'Farmer', owner);
            });
            return animalRegistry.addAll(animalAsset.container);
        })
}