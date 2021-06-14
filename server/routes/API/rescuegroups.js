const router = require("express").Router();
const axios = require('axios');

router.route("/").post(function(req, res) {
    console.log("Search term in back-end API :" + req.body.searchField);
    console.log("Species to search in back-end API: " + req.body.speciesSearch)
    let species;
    let breed;
    if (!req.body.searchField) {
        if (species === "dog") {
            breed="dog"
        }
        if (species === "cat") {
            breed="tabby"
        }
    } else {
        breed=req.body.searchField
    }
    return axios.post("https://api.rescuegroups.org/http/v2.json", {
        "apikey" : process.env.API_KEY,
        "objectType" : "animals",
        "objectAction" : "publicSearch",
        "search" : {
            "resultStart" : 0,
            "resultLimit" : 12,
            "resultSort" : "animalID",
            "resultOrder" : "asc",
            "calcFoundRows" : "Yes",
            "filters" : [
                {
                "fieldName" : "animalBreed",
                "operation" : "contains",
                "criteria" : breed
                },
                {
                "fieldName" : "animalLocationDistance",
                "operation" : "radius",
                "criteria" : "90"
                },
                {
                "fieldName" : "animalSpecies",
                "operation" : "equals",
                "criteria" : req.body.speciesSearch || "dog"
                },
                {
                "fieldName" : "animalLocationDistance",
                "operation" : "radius",
                "criteria" : "30"
                },
                {
                "fieldName" : "animalLocation",
                "operation" : "equals",
                "criteria" : req.body.zipCode || "95616"
                },
                {
                "fieldName" : "animalStatus",
                "operation" : "equals",
                "criteria" : "available"
                }
            ],
            "fields": ["animalID","animalOrgID","animalActivityLevel","animalAdoptedDate","animalAdoptionFee","animalAgeString","animalAltered","animalAvailableDate","animalBirthdate","animalBreed","animalCoatLength","animalColor","animalColorDetails","animalDescription","animalEnergyLevel","animalEyeColor","animalHouseTrained","animalLocation","animalLocationCitystate","animalMixedBreed","animalName","animalSpecialNeedsDescription","animalNeedsFoster","animalOKWithAdults","animalOKWithCats","animalOKWithDogs","animalOKWithKids","animalPattern","animalPrimaryBreed","animalSecondaryBreed","animalRescueID","animalSex","animalSpecies","animalThumbnailUrl","animalUrl","locationAddress","locationPostalCode","animalPictures","animalVideos","animalVideoUrls"]
        }
    }).then(response => {
        res.json(response.data)
    }).catch(err => {
        console.log(err);
    })
})

module.exports = router;