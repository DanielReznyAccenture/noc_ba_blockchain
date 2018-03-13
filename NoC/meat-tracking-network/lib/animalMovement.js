/**
 *
 * @param {org.accenture.com.asset.AnimalMovementDeparture} movementDeparture
 * @transaction
 */

var NSP = 'org.accenture.com.participant.';
function onAnimalMovementDeparture(movementDeparture) {
    console.log('onAnimalMovementDeparture');
    if (movementDeparture.animal.animalProperty.movementStatus !== 'IN_FIELD') {
        throw new Error('Animal is already IN_TRANSIT');
    }

    // set the movement status of the animal
    movementDeparture.animal.animalProperty.movementStatus = 'IN_TRANSIT';

    // save the animal
    return getAssetRegistry('org.accenture.com.asset.Animal')
        .then(function (ar) {
            return ar.update(movementDeparture.animal);
        })
        .then(function () {
            // add the animal to the incoming animals of the
            // destination business
            if (movementDeparture.to.incomingAnimals) {
                movementDeparture.to.incomingAnimals.push(movementDeparture.animal);
            } else {
                movementDeparture.to.incomingAnimals = [movementDeparture.animal];
            }

            // save the business
            console.log(movementDeparture.to)
            var temp = 'org.accenture.com.participant.' + movementDeparture.to.$type;
            console.log(temp)
            return getParticipantRegistry(temp);
        })
        .then(function (br) {
            return br.update(movementDeparture.to);
        });
}

/**
 *
 * @param {org.accenture.com.asset.AnimalMovementArrival} movementArrival
 * @transaction
 */
function onAnimalMovementArrival(movementArrival) {
    console.log('onAnimalMovementArrival');

    if (movementArrival.animal.animalProperty.movementStatus !== 'IN_TRANSIT') {
        throw new Error('Animal is not IN_TRANSIT');
    }

    // set the movement status of the animal
    movementArrival.animal.animalProperty.movementStatus = 'IN_FIELD';

    // set the new owner of the animal
    // to the owner of the 'to' business
    movementArrival.animal.owner = movementArrival.to.owner;

    // set the new location of the animal
    movementArrival.animal.location = movementArrival.arrivalField;

    // save the animal
    return getAssetRegistry('org.accenture.com.asset.Animal')
        .then(function (ar) {
            return ar.update(movementArrival.animal);
        })
        .then(function () {
            // remove the animal from the incoming animals
            // of the 'to' business
            if (!movementArrival.to.incomingAnimals) {
                throw new Error('Incoming business should have incomingAnimals on AnimalMovementArrival.');
            }

            movementArrival.to.incomingAnimals = movementArrival.to.incomingAnimals
                .filter(function (animal) {
                    return animal.animalId !== movementArrival.animal.animalId;
                });

            // save the business
            
            var temp = 'org.accenture.com.participant.' + movementDeparture.to.$type;
            console.log(temp)
            return getParticipantRegistry(temp);
        })
        .then(function (br) {
            return br.update(movementArrival.to);
        });
}