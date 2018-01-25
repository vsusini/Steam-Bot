const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const SteamCommunity = require("steamcommunity");
const TradeOfferManager = require("steam-tradeoffer-manager");

const client = new SteamUser();
const community = new SteamCommunity();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: "en"
});


//To Change Log in information to sign into any account.
//Code of iamflipster: 7PyvQ1Cqc1P8p0Bbfb/zm36zR7M=
const logOnOptions = {
    accountName: "pubgradebot",
    password: "SimpleFlip3",
    twoFactorCode: SteamTotp.generateAuthCode("7J4UnsxXoNmjkRCAjhfa33SroA8=_")
};

client.logOn(logOnOptions);

//works here
client.on("loggedOn", () => {
    console.log("The bot has successfully logged on to Steam.");
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed("Custom Game");
});


//Works here
client.on("friendMessage", function (steamID, message) {
    if (message == "hi") {
        client.chatMessage(steamID, "hello, this works!");
    }
});

client.on("webSession", (sessionid, cookies) => {
    manager.setCookies(cookies);

    community.setCookies(cookies);
    community.startConfirmationChecker(20000, "7J4UnsxXoNmjkRCAjhfa33SroA8=_");
});

function acceptOffer(offer) {
    offer.accept((err) => {
        community.checkConfirmation();
        console.log("We accepted an offer");
        if (err) console.log("There was an error accepting the offer.");
    });
}

function declineOffer(offer) {
    offer.decline((err) => {
        console.log("We declined an offer");
        if (err) console.log("There was an error declining the offer.");
    });
}

//client.setOption("promptSteamGuardCode", false);

/*manager.on("newOffer", (offer) => {
    if (offer.partner.getSteamID64() === "76561198088020208") {
        acceptOffer(offer);
    } else {
        declineOffer(offer);
    }
});*/

manager.on("newOffer", (offer) => {
    if (offer.itemsToGive.length === 0) {
        offer.accept((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Trade was fully accepted");
            }
        });
    } else {
        offer.decline((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Trade was declined!");
            }
        });
    }
});