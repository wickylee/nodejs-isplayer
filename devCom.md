# node and yarn commands
# refs: https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/
npm install -g express-generator
express -v -c
express --no-view

# build frontend
nvm list
nvm use 14 <for build frontend [npm run-script build] >
npm install
node-isplayer/frontend
npm run-script build

# running NodeJS backend server 
nvm use 18 // for run backendls
DEBUG=node-isplayer:* npm start
nodemon app.js

http://localhost:8030/config


# refs for express-react-templat
https://github.com/codingjlu/express-react-template/tree/master

<div class="mediasource" style="background-image: url(&quot;&quot;); background-repeat: no-repeat; background-size: contain;"></div>

/media/org_2/brand_1/source/demo_menu_01_partial2_1694158926.png

https://cloud.icast.com.hk/media/org_2/brand_11/source/demo_menu_01_partial1_1694158749.png

/Users/wickylee/devProjects/node-isplayer/public
# call NodeJS web server action for download default fonts

http://localhost:8030/api/downloadwebfonts

NotoSerif-CondensedBold.ttf
FiraSans-SemiBoldItalic.ttf

    @font-face { font-family: "FiraSansCondensed Light"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-Light.ttf"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "FiraSansCondensed Light"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-LightItalic.ttf"); font-weight: normal; font-style: italic; }
    @font-face { font-family: "FiraSansCondensed"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-Regular.ttf"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "FiraSansCondensed"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-Italic.ttf"); font-weight: normal; font-style: italic; }
    @font-face { font-family: "FiraSansCondensed"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-Bold.ttf"); font-weight: bold; font-style: normal; }
    @font-face { font-family: "FiraSansCondensed"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-BoldItalic.ttf"); font-weight: bold; font-style: italic; }
    @font-face { font-family: "FiraSansCondensed Black"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-Black.ttf"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "FiraSansCondensed Black"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-BlackItalic.ttf"); font-weight: normal; font-style: italic; }
    @font-face { font-family: "FiraSansCondensed SemiBold"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-SemiBold.ttf"); font-weight: normal; font-style: normal; }
    @font-face { font-family: "FiraSansCondensed SemiBold"; src: url("/static/webfonts/firasans/firasanscondensed/FiraSansCondensed-SemiBoldItalic.ttf"); font-weight: normal; font-style: italic; }


https://cloud.icast.com.hk
wss://iticket.icast.com.hk
311
Signage Display 1

https://devpro.icast.com.hk
wss://devws.icast.com.hk
dev-player1
46

http://127.0.0.1:3000/api/player/searchIkey/

this.setPlayerKey(nodeSiteConfigs.getString("api_key"));
this.setPlayer(nodeSiteConfigs.getString("palyer_name"), nodeSiteConfigs.getString("name"));
this.setBrand(nodeSiteConfigs.getString("brand_name"),  Integer.parseInt(nodeSiteConfigs.getString("brand_id")));
this.setDisplay(nodeSiteConfigs.getString("display_name"),  Integer.parseInt(nodeSiteConfigs.getString("display_id")));

"org_key":"Org API Key",
"player_name":"Player Name",
"brand_name":"Brand Name",
"brand_id":0,
"display_name":"Display Name"

https://cloud.icast.com.hk/api/display/46/publishtime_v2/


publish_at: 2024-11-28T07:22:58.596090Z

http://localhost:3000/media/org_35/brand_60/source/digital-solutions_1744349399.jpg

# fusionitemStatusChange
Get fusionitemStatusChange WS command
{
    "command": "fusionitem_status_change",
    "socketData": {
        "id": 474,
        "fusionItem": {
            "id": 1070,
            "fusionView": 113,
            "listItem": 9066,
            "bounditem": 3491
        },
        "status": {
            "id": 16,
            "name": "20-percent-off",
            "brand": 11,
            "mediasource": {
                "id": 4741,
                "brand": 11,
                "name": "20-percent-off_1659421369.png",
                "media_type": {
                    "id": 19,
                    "value": "proStatusImage",
                    "text_e": "ProStatusImage",
                    "text_s": "產品狀態圖",
                    "optiontype": 2
                },
                "app_group": 1,
                "pvg": null,
                "pvg_id": null,
                "content": "/media/org_2/brand_11/source/20-percent-off_1659421369.png",
                "file_path": "/home/isignicast_gmail_com/webapp/icast/frontend/media/org_2/brand_11/source//20-percent-off_1659421369.png",
                "width": 1000,
                "height": 658,
                "search_tags": "",
                "style": null,
                "style_id": null
            }
        },
        "effective": true,
        "create_at": "2025-05-16T03:42:23Z"
    }
}
Fusion Item Status Change Callback:
{
    "id": 474,
    "fusionItem": {
        "id": 1070,
        "fusionView": 113,
        "listItem": 9066,
        "bounditem": 3491
    },
    "status": {
        "id": 16,
        "name": "20-percent-off",
        "brand": 11,
        "mediasource": {
            "id": 4741,
            "brand": 11,
            "name": "20-percent-off_1659421369.png",
            "media_type": {
                "id": 19,
                "value": "proStatusImage",
                "text_e": "ProStatusImage",
                "text_s": "產品狀態圖",
                "optiontype": 2
            },
            "app_group": 1,
            "pvg": null,
            "pvg_id": null,
            "content": "/media/org_2/brand_11/source/20-percent-off_1659421369.png",
            "file_path": "/home/isignicast_gmail_com/webapp/icast/frontend/media/org_2/brand_11/source//20-percent-off_1659421369.png",
            "width": 1000,
            "height": 658,
            "search_tags": "",
            "style": null,
            "style_id": null
        }
    },
    "effective": true,
    "create_at": "2025-05-16T03:42:23Z"
}
update fusionItemRun Status 
[
    {
        "id": 473,
        "fusionItem": {
            "id": 1069,
            "fusionView": 113,
            "listItem": 9065,
            "bounditem": 3458
        },
        "status": {
            "id": 16,
            "name": "20-percent-off",
            "brand": 11,
            "mediasource": {
                "id": 4741,
                "brand": 11,
                "name": "20-percent-off_1659421369.png",
                "media_type": {
                    "id": 19,
                    "value": "proStatusImage",
                    "text_e": "ProStatusImage",
                    "text_s": "產品狀態圖",
                    "optiontype": 2
                },
                "app_group": 1,
                "pvg": null,
                "pvg_id": null,
                "content": "/media/org_2/brand_11/source/20-percent-off_1659421369.png",
                "file_path": "/home/isignicast_gmail_com/webapp/icast/frontend/media/org_2/brand_11/source//20-percent-off_1659421369.png",
                "width": 1000,
                "height": 658,
                "search_tags": "",
                "style": null,
                "style_id": null
            }
        },
        "effective": true,
        "create_at": "2025-05-16T03:42:04Z"
    },
    {
        "id": 474,
        "fusionItem": {
            "id": 1070,
            "fusionView": 113,
            "listItem": 9066,
            "bounditem": 3491
        },
        "status": {
            "id": 16,
            "name": "20-percent-off",
            "brand": 11,
            "mediasource": {
                "id": 4741,
                "brand": 11,
                "name": "20-percent-off_1659421369.png",
                "media_type": {
                    "id": 19,
                    "value": "proStatusImage",
                    "text_e": "ProStatusImage",
                    "text_s": "產品狀態圖",
                    "optiontype": 2
                },
                "app_group": 1,
                "pvg": null,
                "pvg_id": null,
                "content": "/media/org_2/brand_11/source/20-percent-off_1659421369.png",
                "file_path": "/home/isignicast_gmail_com/webapp/icast/frontend/media/org_2/brand_11/source//20-percent-off_1659421369.png",
                "width": 1000,
                "height": 658,
                "search_tags": "",
                "style": null,
                "style_id": null
            }
        },
        "effective": true,
        "create_at": "2025-05-16T03:42:23Z"
    }
]