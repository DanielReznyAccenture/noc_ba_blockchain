/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/*eslint-disable no-unused-vars*/
/*eslint-disable no-undef*/

/**
 *
 * @param {org.accenture.com.asset.KillAnimal} slaughterDetails
 * @transaction
 */
function killAnimal(slaughterDetails) {
    var animalRegistry = {}
    var killedAnimalRegistry = {}
    var NS = 'org.accenture.com.asset';
    var NSP = 'org.accenture.com.participant';
    var animal = slaughterDetails.animal;

    return getAssetRegistry('org.accenture.com.asset.Animal').then(function (ar) {
        animalRegistry = ar
        if (!animal) throw new Error("Animal with the ID : " + animal.animalId, " Not Found!!!");
        if(!animal.owner.identifier === slaughterDetails.butchery.identifier) throw new Error("Butchery: " + slaughterDetails.butchery +"not the owner of the animal: "+ animal.animalId)
        return getAssetRegistry('org.accenture.com.asset.KilledAnimal').then(function (registry) {
            // create a killed animal instance and delete the old animal from the registry,also change the owner of the killed animal
            killedAnimalRegistry = registry
            var factory = getFactory()
            var newkilledAnimal = factory.newResource(NS, 'KilledAnimal', "KilledAnimal_" + animal.identifier)
            newkilledAnimal.animalProperty = animal.animalProperty
            newkilledAnimal.owner = slaughterDetails.butchery
            newkilledAnimal.animal = animal
            killedAnimalRegistry.add(newkilledAnimal)
            console.log(newkilledAnimal)
            animalRegistry.remove(animal)
        })
    }).then(function () {
        // Successful update

    }).catch(function (error) {
        throw new Error(error);
    });

}

/**
 *
 * @param {org.accenture.com.asset.SellGoodsToNewOwner} transactionDetailsBetweenOwners
 * @transaction
 */
function sellAnimalToNewOwner(transactionDetailsBetweenOwners) {
    var assetRegistry = {}
    var NS = 'org.accenture.com.asset';
    var NSP = 'org.accenture.com.participant';
    var asset = transactionDetailsBetweenOwners.element

    return getAssetRegistry('org.accenture.com.asset.' + asset.$type).then(function (registry) {
        assetRegistry = registry
    }).then(function () {
        if (!asset) throw new Error("Asset not found : " + asset.identifier, " Not Found!!!");

        // update ownership of animal
        else {
            asset.owner = transactionDetailsBetweenOwners.newOwner
            console.log("Owner has changed of asset " + asset.identifier)
            assetRegistry.update(asset)
        }
    }
    )
}
/**
 *
 * @param {org.accenture.com.asset.CreateRawMaterial} creationDetails
 * @transaction
 */
function createRawMeat(creationDetails) {
    var rawMeatRegistry = {};
    var killedAnimalRegistry = {};
    var NS = 'org.accenture.com.asset';
    var NSP = 'org.accenture.com.participant';
    var killedAnimal = creationDetails.killedAnimal
    

    return getAssetRegistry('org.accenture.com.asset.KilledAnimal').then(function (killRegistry) {
        killedAnimalRegistry = killRegistry;
        if (!killedAnimal) throw new Error("KilledAnimal with the ID : " + killedAnimal.identifier, " Not Found!!!");   
    return getAssetRegistry('org.accenture.com.asset.RawMaterial').then(function (rawRegistry) {
        

        // create RawMaterial and remove a KilledAnimal asset
    
            rawMeatRegistry= rawRegistry
            var factory = getFactory()
            var newRawMeat = factory.newResource(NS, 'RawMaterial', "RAWMATERIAL_1")
            newRawMeat.identifier = killedAnimal.identifier
            newRawMeat.owner = creationDetails.butchery
            newRawMeat.createdBy = creationDetails.butchery
            newRawMeat.movementStatus = "AT_BUTCHER"
            newRawMeat.productType = creationDetails.productType
            console.log("Adding new raw meat to registry with id: " + newRawMeat.materialId)
            rawMeatRegistry.add(newRawMeat)
            killedAnimalRegistry.remove(killedAnimal)
            console.log("Removed killedanimal from registry with values: " + killedAnimal.identifier)       
        })
    }).then(function () {
        // Successful update

    }).catch(function (error) {
        throw new Error(error);
    });

}



/*eslint-enable no-unused-vars*/
/*eslint-enable no-undef*/
