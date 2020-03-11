"use strict";
// Author: Sander meyfroot
// email: sander.meyfroot@is4u.be
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const request = require("request-promise-native");
let mappingruleId = 0;
let mappingruleName = "";
var username = "";
var password = "";
let applianceHost = "";
let auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
function downloadTrace() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Downloading trace file');
        (() => __awaiter(this, void 0, void 0, function* () {
            const baseUrl = 'https://' + applianceHost + '/isam/application_logs/federation/runtime/trace.log';
            var options = {
                method: "GET",
                uri: baseUrl,
                insecure: true,
                "rejectUnauthorized": false,
                headers: {
                    "Authorization": auth,
                    "Accept": "application/json",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
            };
            const result = yield request.get(options);
            yield vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    if (editor) {
                        editBuilder.insert(new vscode.Position(0, 0), JSON.parse(result).contents);
                    }
                });
            }
            vscode.window.showInformationMessage('Trace file downloaded');
        }))();
    });
}
exports.downloadTrace = downloadTrace;
function clearTrace() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Clearing trace file');
        (() => __awaiter(this, void 0, void 0, function* () {
            const baseUrl = 'https://' + applianceHost + '/isam/application_logs/federation/runtime/trace.log?action=clear';
            var options = {
                method: "DELETE",
                uri: baseUrl,
                insecure: true,
                "rejectUnauthorized": false,
                headers: {
                    "Authorization": auth,
                    "Accept": "application/json",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
            };
            const result = yield request.delete(options);
            vscode.window.showInformationMessage('Trace file cleared');
        }))();
    });
}
exports.clearTrace = clearTrace;
function deployChanges(isChain) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Deploying changes');
        (() => __awaiter(this, void 0, void 0, function* () {
            const baseUrl = 'https://' + applianceHost + '/isam/pending_changes';
            var options = {
                method: "PUT",
                uri: baseUrl,
                insecure: true,
                "rejectUnauthorized": false,
                headers: {
                    "Authorization": auth,
                    "Accept": "application/json",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
            };
            const result = yield request.put(options);
            vscode.window.showInformationMessage('Changes deployed');
            if (isChain) {
                yield reloadfedRuntime(true);
            }
        }))();
    });
}
exports.deployChanges = deployChanges;
function uploadMappingRule(isChain) {
    return __awaiter(this, void 0, void 0, function* () {
        if (mappingruleId !== undefined && mappingruleId !== 0) {
            vscode.window.showInformationMessage('Got mapping rule identifier, uploading...');
            let editor = vscode.window.activeTextEditor;
            let text = "";
            if (editor !== undefined) {
                text = editor.document.getText();
            }
            //console.log(text);
            if (text !== undefined) {
                text = text.replace(/\"/g, '\\"');
            }
            (() => __awaiter(this, void 0, void 0, function* () {
                const baseUrl = 'https://' + applianceHost + '/iam/access/v8/mapping-rules/' + mappingruleId;
                //console.log(baseUrl);
                let body_to_send = "{\"content\":\"" + text + "\"}";
                //console.log(body_to_send);
                var options = {
                    body: body_to_send,
                    method: "PUT",
                    uri: baseUrl,
                    insecure: true,
                    "rejectUnauthorized": false,
                    headers: {
                        "Authorization": auth,
                        "content-type": "application/json",
                        "Accept": "application/json",
                        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                    }
                };
                const result = yield request.put(options);
                vscode.window.showInformationMessage('Upload done');
                if (isChain) {
                    yield deployChanges(true);
                }
            }))();
        }
        else {
            vscode.window.showInformationMessage('No mapping rule in cache, register mapping rule');
        }
    });
}
exports.uploadMappingRule = uploadMappingRule;
function reloadfedRuntime(isChain) {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Reloading federation runtime');
        (() => __awaiter(this, void 0, void 0, function* () {
            const baseUrl = 'https://' + applianceHost + '/mga/runtime_profile/local/v1';
            var options = {
                body: "{operation: \"reload\"}",
                method: "PUT",
                uri: baseUrl,
                insecure: true,
                "rejectUnauthorized": false,
                headers: {
                    "Authorization": auth,
                    "Accept": "application/json",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
            };
            const result = yield request.put(options);
            vscode.window.showInformationMessage('Reloaded federation runtime');
            if (isChain) {
                vscode.window.showInformationMessage('Action chain completed');
            }
        }))();
    });
}
exports.reloadfedRuntime = reloadfedRuntime;
function getMappingRuleId() {
    return __awaiter(this, void 0, void 0, function* () {
        (() => __awaiter(this, void 0, void 0, function* () {
            const baseUrl = 'https://' + applianceHost + '/iam/access/v8/mapping-rules/?filter=name%20equals%20' + mappingruleName;
            var options = {
                method: "GET",
                uri: baseUrl,
                insecure: true,
                "rejectUnauthorized": false,
                headers: {
                    "Authorization": auth,
                    "Accept": "application/json",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
                }
            };
            const result = yield request.get(options);
            let mappingid = JSON.parse(result)[0].id;
            if (mappingid !== undefined) {
                if (mappingid !== 0) {
                    mappingruleId = mappingid;
                    vscode.window.showInformationMessage('saved mappingrule ID');
                }
                else {
                    vscode.window.showInformationMessage('Mapping rule not found');
                    mappingruleId = 0;
                }
            }
            //console.log(mappingid);
        }))();
    });
}
exports.getMappingRuleId = getMappingRuleId;
function showInputBox() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode.window.showInputBox({
            value: mappingruleName
        });
        vscode.window.showInformationMessage(`Got: ${result}`);
        if (result === undefined) {
            mappingruleName = "";
        }
        else {
            mappingruleName = result;
            getMappingRuleId();
        }
    });
}
exports.showInputBox = showInputBox;
function registerHost() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Setting hostname');
        var result;
        if (applianceHost === undefined || applianceHost === "") {
            result = yield vscode.window.showInputBox({
                value: "<set your appliance hostname>"
            });
        }
        else {
            result = yield vscode.window.showInputBox({
                value: applianceHost
            });
        }
        vscode.window.showInformationMessage(`Got hostname: ${result}`);
        if (result !== undefined && result !== "") {
            applianceHost = result;
            if (username === undefined || username === "") {
                vscode.window.showInformationMessage('Setting username');
                result = yield vscode.window.showInputBox({
                    value: "admin"
                });
            }
            else {
                vscode.window.showInformationMessage('Setting username');
                result = yield vscode.window.showInputBox({
                    value: username
                });
            }
            vscode.window.showInformationMessage(`Got username: ${result}`);
            if (result !== undefined && result !== "") {
                username = result;
                if (password === undefined || password === "") {
                    vscode.window.showInformationMessage('Setting password');
                    result = yield vscode.window.showInputBox({
                        value: "<set your password>"
                    });
                }
                else {
                    result = yield vscode.window.showInputBox({
                        value: password
                    });
                }
                if (result !== undefined && result !== "") {
                    password = result;
                    auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
                }
            }
        }
    });
}
exports.registerHost = registerHost;
function settingsValid() {
    if (username !== undefined && username !== "" && password !== undefined && password !== "" && applianceHost !== undefined && applianceHost !== "") {
        return true;
    }
    else {
        vscode.window.showInformationMessage('No credentials/host found, execute ISAM Register host command');
        return false;
    }
}
exports.settingsValid = settingsValid;
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.uploadMappingrule', () => {
        if (settingsValid()) {
            uploadMappingRule(false);
        }
    });
    disposable = vscode.commands.registerCommand('extension.registerMappingrule', () => {
        if (settingsValid()) {
            showInputBox();
        }
    });
    disposable = vscode.commands.registerCommand('extension.reloadRuntime', () => {
        if (settingsValid()) {
            reloadfedRuntime(false);
        }
    });
    disposable = vscode.commands.registerCommand('extension.deployChanges', () => {
        if (settingsValid()) {
            deployChanges(false);
        }
    });
    disposable = vscode.commands.registerCommand('extension.doAll', () => __awaiter(this, void 0, void 0, function* () {
        if (settingsValid()) {
            yield uploadMappingRule(true);
        }
    }));
    disposable = vscode.commands.registerCommand('extension.downloadTrace', () => {
        if (settingsValid()) {
            downloadTrace();
        }
    });
    disposable = vscode.commands.registerCommand('extension.clearTrace', () => {
        if (settingsValid()) {
            clearTrace();
        }
    });
    disposable = vscode.commands.registerCommand('extension.registerHost', () => {
        registerHost();
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map