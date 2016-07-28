/*global Chronos LPWidgetSDK*/
(function () {

    var lpWidgetSDK,
        widgetSDKAPI = lpTag.LPWidgetSDK.API,
        bindingEvent = [widgetSDKAPI.events.CONVERSATION_INFO, widgetSDKAPI.events.MESSAGES, widgetSDKAPI.events.PARTICIPANTS, widgetSDKAPI.events.UI_WINDOW, widgetSDKAPI.events.UI_WIDGET],
        lastPEl,
        notificationContainer,
        queryParamsContainer,
        intervalButton,
        intervalInput,
        intervalValue,
        notificationsCount = 0,
        isQueryParamsContainerDisplayed = false,

        intervalId = -1,
        intervalCounterId,

        START_NOTIFICATION_TEXT = "start send notification",
        STOP_NOTIFICATION_TEXT = "stop send notification";


    START_NOTIFICATION_TEXT = "start send notification",
        STOP_NOTIFICATION_TEXT = "stop send notification";

    window.addEventListener("load", function () {
        var opts = {bind: {}};

        bindingEvent.forEach(function (eventName) {
            opts.bind[eventName] = {func: _onEvent, context: this};
        });

        lpWidgetSDK = lpTag.LPWidgetSDK.init(opts);

        queryParamsContainer = window.document.getElementById("queryParamsContainer");
        notificationContainer = window.document.getElementById("notification_container");
        intervalButton = window.document.getElementById("notification_interval_button");
        intervalInput = window.document.getElementById("notification_interval");
        window.document.getElementById("disposeButton").addEventListener("click", disposeWidget);
        window.document.getElementById("toggleParamsButton").addEventListener("click", toggleQueryParams);
        intervalButton.addEventListener("click", setNotificationInterval);
        setRandomTitleColor();
        _handleQueryParams();
    }.bind(this));

    function _handleQueryParams() {
        var queryParamslist = lpWidgetSDK.getQuery(),
            pElement;

        queryParamslist = lpWidgetSDK.getQuery();

        Object.keys(queryParamslist).forEach(function (key) {
            pElement = document.createElement("p");
            pElement.innerHTML = key + " : " + queryParamslist[key] + "</br>";
            queryParamsContainer.appendChild(pElement);
        });

        document.getElementById("test_widget_title").innerHTML = queryParamslist["widgetName"] + " Widget";
    }

    function sendNotification() {
        var data = {content: "notification from widget"};
        lpWidgetSDK.notify(data, notificationCallback);
    }

    function disposeWidget() {
        lpWidgetSDK.dispose(function (data) {
            /*do something*/
        });
    }

    function notificationCallback(err) {
        if (err) {
            _onEvent({err: "Error on sending notification from widget"});
        }
    }

    function _onEvent(eventData) {
        var dateString,
            currentPEl;

        if (typeof eventData === "object") {
            dateString = new Date().toString();
            currentPEl = document.createElement("p");
            currentPEl.innerHTML = "<hr>" + ++notificationsCount + ". " + dateString.substr(0, dateString.indexOf("GMT") - 1) + "</br>" + JSON.stringify(eventData) + "</br>";

            if (lastPEl) {
                notificationContainer.insertBefore(currentPEl, lastPEl);
            } else {
                notificationContainer.appendChild(currentPEl);
            }
            lastPEl = currentPEl;
        }
    }

    function toggleQueryParams() {
        if (isQueryParamsContainerDisplayed) {
            queryParamsContainer.style.display = "none";
            notificationContainer.style.display = "inherit";
            isQueryParamsContainerDisplayed = false;
        } else {
            queryParamsContainer.style.display = "inherit";
            notificationContainer.style.display = "none";
            isQueryParamsContainerDisplayed = true;
        }
    }

    function setNotificationInterval() {
        if (intervalId === -1) {
            _startNotificationInterval();
        } else {
            _stopNotificationInterval();
        }
    }

    function _startNotificationInterval() {
        if (Number(intervalInput.value) && Math.ceil(intervalInput.value) > 0) {
            intervalValue = Math.ceil(intervalInput.value);

            intervalInput.value = intervalValue;
            intervalInput.disabled = true;

            intervalButton.innerHTML = STOP_NOTIFICATION_TEXT;
            intervalButton.style.background = "red";

            //send notification interval
            intervalId = setInterval(function () {
                sendNotification();
            }, intervalValue * 1000);

            //change counter value interval
            intervalCounterId = setInterval(function () {
                if (intervalInput.value > 1) {
                    intervalInput.value -= 1;
                } else {
                    intervalInput.value = intervalValue;
                }
            }, 1000);
        }
        else {
            intervalInput.value = 0;
        }
    }

    function setRandomTitleColor() {
        var letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
            color = '#';

        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        document.getElementById("test_widget_title").style.background = color;
    }

    function _stopNotificationInterval() {
        clearInterval(intervalId);
        clearInterval(intervalCounterId);
        intervalInput.disabled = false;
        intervalId = -1;
        intervalValue = 0;
        intervalInput.value = intervalValue;
        intervalButton.innerHTML = START_NOTIFICATION_TEXT;
        intervalButton.style.background = "greenyellow";
    }
})
();


