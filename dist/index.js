var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/secure-page-viewer/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/secure-page-viewer/utils.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSCConfigByCodeCid = exports.fetchFileContentByCid = exports.IPFS_SCOM_URL = void 0;
    ///<amd-module name='@scom/secure-page-viewer/utils.ts'/> 
    const IPFS_SCOM_URL = "https://ipfs.scom.dev/ipfs";
    exports.IPFS_SCOM_URL = IPFS_SCOM_URL;
    async function fetchFileContentByCid(ipfsCid) {
        let response;
        try {
            response = await fetch(`${IPFS_SCOM_URL}/${ipfsCid}`);
        }
        catch (err) {
            const IPFS_Gateway = 'https://ipfs.io/ipfs/{CID}';
            response = await fetch(IPFS_Gateway.replace('{CID}', ipfsCid));
        }
        return response;
    }
    exports.fetchFileContentByCid = fetchFileContentByCid;
    ;
    async function getSCConfigByCodeCid(codeCid) {
        let scConfig;
        try {
            let scConfigRes = await fetchFileContentByCid(`${codeCid}/dist/scconfig.json`);
            if (scConfigRes)
                scConfig = await scConfigRes.json();
        }
        catch (err) { }
        return scConfig;
    }
    exports.getSCConfigByCodeCid = getSCConfigByCodeCid;
});
define("@scom/secure-page-viewer/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_1.Styles.Theme.ThemeVars;
    const spin = components_1.Styles.keyframes({
        "to": {
            "-webkit-transform": "rotate(360deg)"
        }
    });
    exports.default = components_1.Styles.style({
        $nest: {
            '.spinner': {
                display: "inline-block",
                width: "50px",
                height: "50px",
                border: "3px solid rgba(255,255,255,.3)",
                borderRadius: "50%",
                borderTopColor: Theme.colors.primary.main,
                "animation": `${spin} 1s ease-in-out infinite`,
                "-webkit-animation": `${spin} 1s ease-in-out infinite`
            }
        }
    });
});
define("@scom/secure-page-viewer/paging.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_2.Styles.Theme.ThemeVars;
    exports.default = components_2.Styles.style({
        $nest: {
            '.raise:hover': {
                boxShadow: `0 0.5em 0.5em -0.4em ${Theme.colors.primary.main}`,
                transform: 'translateY(-0.25em)'
            },
            '.cut-text span': {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                width: '100%'
            },
            '.shadow': {
                boxShadow: '0px 1px 2px rgb(0 0 0 / 12%)'
            }
        }
    });
});
define("@scom/secure-page-viewer/paging.tsx", ["require", "exports", "@ijstech/components", "@scom/secure-page-viewer/paging.css.ts"], function (require, exports, components_3, paging_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewerPaging = void 0;
    let ViewerPaging = class ViewerPaging extends components_3.Module {
        constructor() {
            super(...arguments);
            this._visiblePagesData = [];
            this.currentPageIndex = 0;
            this.prevPageNotExist = true;
            this.nextPageNotExist = true;
        }
        async setPaging(pages, currPage) {
            this._visiblePagesData = pages.filter(element => element.visible == true);
            let currentPageURL;
            if (currPage == undefined) {
                let isCurrentPageActive = this._visiblePagesData.includes(this._currentPageData);
                currentPageURL = isCurrentPageActive ? this._currentPageData.url : "nullUrl";
            }
            else {
                this._currentPageData = currPage;
                currentPageURL = currPage.url;
            }
            this.currentPageIndex = this._visiblePagesData.findIndex(element => element.url == currentPageURL);
            this.prevPageNotExist = (this.currentPageIndex == 0 || this.currentPageIndex == -1);
            this.nextPageNotExist = (this.currentPageIndex == this._visiblePagesData.length - 1 || this.currentPageIndex == -1);
            this.renderUI();
        }
        setVisible(visible) {
            this.visible = visible;
        }
        async renderUI() {
            if (this._visiblePagesData == undefined)
                return;
            this.prevPageWrapper.visible = this.prevPageNotExist ? false : true;
            this.nextPageWrapper.visible = this.nextPageNotExist ? false : true;
            if (this.prevPageNotExist && this.nextPageNotExist) {
                this.prevPageWrapper.width = '0%';
                this.nextPageWrapper.width = '0%';
            }
            else if (this.prevPageNotExist) {
                this.prevPageWrapper.width = '0%';
                this.nextPageWrapper.width = '100%';
            }
            else if (this.nextPageNotExist) {
                this.prevPageWrapper.width = '100%';
                this.nextPageWrapper.width = '0%';
            }
            else {
                this.prevPageWrapper.width = '50%';
                this.nextPageWrapper.width = '50%';
            }
            if (this.currentPageIndex != -1) {
                this.prevPageLabel.caption = this.prevPageNotExist ? "" : this._visiblePagesData[this.currentPageIndex - 1].name;
                this.nextPageLabel.caption = this.nextPageNotExist ? "" : this._visiblePagesData[this.currentPageIndex + 1].name;
            }
        }
        navToPrevPage() {
            if (this.prevPageNotExist || this.currentPageIndex == -1)
                return;
            if (this.onPrevPage) {
                this.onPrevPage(this._visiblePagesData[this.currentPageIndex - 1]);
            }
        }
        navToNextPage() {
            if (this.nextPageNotExist || this.currentPageIndex == -1)
                return;
            if (this.onNextPage) {
                this.onNextPage(this._visiblePagesData[this.currentPageIndex + 1]);
            }
        }
        render() {
            return (this.$render("i-hstack", { id: "paging-container", class: paging_css_1.default, padding: { left: '15px', top: '10px', right: '15px', bottom: '10px' }, height: 'auto', width: '100%', justifyContent: "space-between", gap: "15px" },
                this.$render("i-hstack", { id: "prevPageWrapper", width: '50%', height: '85px' },
                    this.$render("i-hstack", { id: "prevPage", class: "pointer raise shadow", width: '100%', height: "100%", onClick: this.navToPrevPage.bind(this), border: { radius: '4px', width: '1px', style: 'solid', color: 'rgba(227,232,237,1.00)' }, padding: { top: '16px', right: '16px', bottom: '16px', left: '16px' }, verticalAlignment: "center", justifyContent: "space-between" },
                        this.$render("i-icon", { name: "arrow-left", width: '20px', height: '20px', margin: { right: '20px' } }),
                        this.$render("i-vstack", { height: "100%", maxWidth: "70%", gap: "7px", horizontalAlignment: 'end' },
                            this.$render("i-label", { caption: "Previous", font: { color: 'grey', size: "12px" } }),
                            this.$render("i-label", { id: 'prevPageLabel', maxWidth: '100%', class: "cut-text", caption: "prevPage", font: { name: "roboto", size: "20px" } })))),
                this.$render("i-hstack", { id: "nextPageWrapper", width: '50%', height: '85px' },
                    this.$render("i-hstack", { id: "nextPage", class: "pointer raise shadow", width: '100%', height: "100%", onClick: this.navToNextPage.bind(this), border: { radius: '4px', width: '1px', style: 'solid', color: 'rgba(227,232,237,1.00)' }, padding: { top: '16px', right: '16px', bottom: '16px', left: '16px' }, verticalAlignment: "center", justifyContent: "space-between" },
                        this.$render("i-vstack", { height: "100%", maxWidth: "70%", gap: "7px", horizontalAlignment: 'start' },
                            this.$render("i-label", { caption: "Next", font: { color: 'grey', size: "12px" } }),
                            this.$render("i-label", { id: 'nextPageLabel', maxWidth: '100%', class: "cut-text", caption: "nextPage", font: { name: "roboto", size: "20px" } })),
                        this.$render("i-icon", { name: "arrow-right", width: '20px', height: '20px', margin: { left: '20px' } })))));
        }
    };
    ViewerPaging = __decorate([
        components_3.customElements('scpage-viewer-paging')
    ], ViewerPaging);
    exports.ViewerPaging = ViewerPaging;
});
define("@scom/secure-page-viewer/body.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewrBody = void 0;
    let ViewrBody = class ViewrBody extends components_4.Module {
        async setRows(rows) {
            this.rows = rows;
            await this.renderRows();
        }
        async renderRows() {
            this.clearRows();
            if ((!this.rows || (this.rows && this.rows.length == 0))) {
                this.rows = [{
                        config: {
                            width: '100%',
                            height: '100%',
                            columns: 1,
                        },
                        sections: []
                    }];
            }
            for (const rowData of this.rows) {
                const pageRow = (this.$render("scpage-viewer-row", null));
                this.pnlRows.append(pageRow);
                await pageRow.setData(rowData);
            }
        }
        clearRows() {
            this.pnlRows.clearInnerHTML();
        }
        async setPaging(pages, currPage) {
            await this.viewerPaging.setPaging(pages, currPage);
        }
        setPagingVisibility(pagingVisible) {
            this.viewerPaging.setVisible(pagingVisible);
        }
        render() {
            return (this.$render("i-panel", { height: '100%' },
                this.$render("i-panel", { id: 'pnlRows', padding: { top: 12, bottom: 50 } }),
                this.$render("scpage-viewer-paging", { id: "viewerPaging", visible: false, onPrevPage: this.onUpdatePage.bind(this), onNextPage: this.onUpdatePage.bind(this) })));
        }
    };
    ViewrBody = __decorate([
        components_4.customElements('scpage-viewer-body')
    ], ViewrBody);
    exports.ViewrBody = ViewrBody;
});
define("@scom/secure-page-viewer/sidebar.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_5.Styles.Theme.ThemeVars;
    exports.default = components_5.Styles.style({
        borderRight: `1px solid ${Theme.divider}`,
        $nest: {
            'i-tree-node.is-checked > .i-tree-node_children': {
                marginLeft: '20px'
            },
            '.i-tree-node': {
                $nest: {
                    '&.invisible': {
                        display: 'none'
                    },
                    '.i-tree-node_content': {
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        height: '40px'
                    },
                    '.i-tree-node_icon': {
                        fill: 'black!important'
                    },
                }
            }
        }
    });
});
define("@scom/secure-page-viewer/sidebar.tsx", ["require", "exports", "@ijstech/components", "@scom/secure-page-viewer/sidebar.css.ts"], function (require, exports, components_6, sidebar_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewerSidebar = void 0;
    let ViewerSidebar = class ViewerSidebar extends components_6.Module {
        constructor() {
            super(...arguments);
            this._treeData = [];
        }
        get treeData() {
            return this._treeData;
        }
        set treeData(value) {
            this._treeData = value;
            this.renderUI();
        }
        async renderUI() {
            this.tvMenu.clear();
            let fileNodes = {};
            let self = this;
            async function addFileNode(nodeData) {
                const name = nodeData.name;
                let idx = '';
                let items = nodeData.path.split('/');
                let node = null;
                for (let i = 0; i < items.length; i++) {
                    if (items[i]) {
                        idx = idx + '/' + items[i];
                        if (!fileNodes[idx]) {
                            node = await self.tvMenu.add(node, name);
                            if (!nodeData.visible)
                                node.classList.add('invisible');
                            fileNodes[idx] = node;
                            node.tag = nodeData;
                        }
                        else {
                            node = fileNodes[idx];
                        }
                        if (node)
                            node.expanded = true;
                    }
                }
            }
            for (let nodeData of this.treeData) {
                await addFileNode(nodeData);
            }
        }
        onActiveChange(parent, prevNode) {
            var _a;
            const page = (_a = parent.activeItem) === null || _a === void 0 ? void 0 : _a.tag;
            if (this.onTreeViewActiveChange) {
                this.onTreeViewActiveChange(page);
            }
        }
        resetActiveTreeNode() {
            this.tvMenu.activeItem = undefined;
        }
        render() {
            return (this.$render("i-panel", { class: sidebar_css_1.default, height: '100%' },
                this.$render("i-tree-view", { id: "tvMenu", class: "page-list", height: '100%', padding: { bottom: '20px' }, onActiveChange: this.onActiveChange })));
        }
    };
    ViewerSidebar = __decorate([
        components_6.customElements('scpage-viewer-sidebar')
    ], ViewerSidebar);
    exports.ViewerSidebar = ViewerSidebar;
});
define("@scom/secure-page-viewer/row.tsx", ["require", "exports", "@ijstech/components"], function (require, exports, components_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewrRow = void 0;
    let ViewrRow = class ViewrRow extends components_7.Module {
        async setData(rowData) {
            var _a;
            this.gridSections.clearInnerHTML();
            this.rowData = rowData;
            if (this.rowData.config.width) {
                this.width = this.rowData.config.width;
            }
            if (this.rowData.config.height) {
                // use minHeight instead of height to avoid the overflow of inner containers
                // when the markdown editor is in edit mode
                this.minHeight = this.rowData.config.height;
            }
            this.gridSections.templateColumns = Array(((_a = this.rowData.sections) === null || _a === void 0 ? void 0 : _a.length) || 0).fill("1fr");
            if (this.rowData.sections && this.rowData.sections.length > 0) {
                for (let i = 0; i < this.rowData.sections.length; i++) {
                    const sectionData = this.rowData.sections[i];
                    const pageSection = (this.$render("scpage-viewer-section", null));
                    this.gridSections.append(pageSection);
                    await pageSection.setData(sectionData);
                }
            }
        }
        render() {
            return (this.$render("i-grid-layout", { id: "gridSections", verticalAlignment: 'center' }));
        }
    };
    ViewrRow = __decorate([
        components_7.customElements('scpage-viewer-row')
    ], ViewrRow);
    exports.ViewrRow = ViewrRow;
});
define("@scom/secure-page-viewer/section.tsx", ["require", "exports", "@ijstech/components", "@scom/secure-page-viewer/utils.ts"], function (require, exports, components_8, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewrSection = void 0;
    let ViewrSection = class ViewrSection extends components_8.Module {
        clear() {
            this.pnlModule.clearInnerHTML();
        }
        async setData(sectionData) {
            if (sectionData.module) {
                let module = await this.loadModule(sectionData.module.ipfscid);
                if (module) {
                    if (module.confirm)
                        module.confirm();
                    module.setData(sectionData.data);
                    module.setTag(sectionData.tag);
                }
            }
        }
        async loadModule(ipfsCid) {
            const response = await utils_1.fetchFileContentByCid(ipfsCid);
            if (!response)
                return;
            const result = await response.json();
            const codeCID = result.codeCID;
            const scConfig = await utils_1.getSCConfigByCodeCid(codeCID);
            if (!scConfig)
                return;
            const main = scConfig.main;
            let module;
            if (main.startsWith("@")) {
                scConfig.rootDir = `${utils_1.IPFS_SCOM_URL}/${codeCID}/dist`;
                module = await components_8.application.newModule(main, scConfig, true);
            }
            else {
                const root = `${utils_1.IPFS_SCOM_URL}/${codeCID}/dist`;
                const mainScriptPath = main.replace('{root}', root);
                const dependencies = scConfig.dependencies;
                for (let key in dependencies) {
                    dependencies[key] = dependencies[key].replace('{root}', root);
                }
                module = await components_8.application.newModule(mainScriptPath, { dependencies });
            }
            if (module) {
                this.pnlModule.append(module);
            }
            return module;
        }
        render() {
            return (this.$render("i-panel", { id: "pnlModule" }));
        }
    };
    ViewrSection = __decorate([
        components_8.customElements('scpage-viewer-section')
    ], ViewrSection);
    exports.ViewrSection = ViewrSection;
});
define("@scom/secure-page-viewer", ["require", "exports", "@ijstech/components", "@scom/secure-page-viewer/utils.ts", "@scom/secure-page-viewer/index.css.ts", "@scom/secure-page-viewer/body.tsx", "@scom/secure-page-viewer/row.tsx", "@scom/secure-page-viewer/section.tsx", "@scom/secure-page-viewer/sidebar.tsx", "@scom/secure-page-viewer/paging.tsx"], function (require, exports, components_9, utils_2, index_css_1, body_1, row_1, section_1, sidebar_1, paging_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewerPaging = exports.ViewerSidebar = exports.ViewrSection = exports.ViewrRow = exports.ViewrBody = void 0;
    Object.defineProperty(exports, "ViewrBody", { enumerable: true, get: function () { return body_1.ViewrBody; } });
    Object.defineProperty(exports, "ViewrRow", { enumerable: true, get: function () { return row_1.ViewrRow; } });
    Object.defineProperty(exports, "ViewrSection", { enumerable: true, get: function () { return section_1.ViewrSection; } });
    Object.defineProperty(exports, "ViewerSidebar", { enumerable: true, get: function () { return sidebar_1.ViewerSidebar; } });
    Object.defineProperty(exports, "ViewerPaging", { enumerable: true, get: function () { return paging_1.ViewerPaging; } });
    const Theme = components_9.Styles.Theme.ThemeVars;
    let Viewer = class Viewer extends components_9.Module {
        constructor() {
            super(...arguments);
            this.isLoaded = false;
        }
        async onShow(options) {
            this.pnlLoading.visible = true;
            this.gridMain.visible = false;
            if (!this.isLoaded) {
                this.gridMain.templateColumns = ["1fr"];
                this.viewerSidebar.visible = false;
                if (options === null || options === void 0 ? void 0 : options.cid) {
                    this._data = await this.autoRetryGetIPFSContent(options.cid);
                }
                else {
                    this._data = undefined;
                }
                if (options) {
                    this.params = options.params;
                }
                await this.setData();
            }
            else if (this._data.pages && this._data.pages.length > 0) {
                const page = this._data.pages[0];
                this.viewerSidebar.resetActiveTreeNode();
                this.renderPage(page);
            }
            this.pnlLoading.visible = false;
            this.gridMain.visible = true;
        }
        async setData() {
            var _a;
            if (!this._data)
                return;
            this.pagingVisible = ((_a = this._data.config) === null || _a === void 0 ? void 0 : _a.body.showPagination) || false;
            this.viewerBody.setPagingVisibility(this.pagingVisible);
            this.viewerSidebar.treeData = this._data.pages;
            await this.renderPageByConfig();
            if (this._data.pages && this._data.pages.length > 0) {
                let page;
                if (this.params && "page" in this.params)
                    page = this._data.pages.find(v => v.url === this.params.page);
                if (!page)
                    page = this._data.pages[0];
                this.renderPage(page);
            }
            this.isLoaded = true;
        }
        async renderPageByConfig() {
            var _a, _b;
            if (!this._data)
                return;
            const showSideMenu = ((_b = (_a = this._data.config) === null || _a === void 0 ? void 0 : _a.header) === null || _b === void 0 ? void 0 : _b.showSideMenu) || false;
            this.gridMain.templateColumns = showSideMenu ? ["350px", "1fr"] : ["1fr"];
            this.viewerSidebar.visible = showSideMenu;
            const rows = this._data.pages[0].rows;
            await this.viewerBody.setRows(rows);
        }
        async renderPage(page) {
            await this.viewerBody.setRows(page.rows);
            await this.viewerBody.setPaging(this._data.pages, page);
            this.viewerBody.setPagingVisibility(this.pagingVisible);
        }
        async autoRetryGetIPFSContent(cid) {
            return new Promise((resolve, reject) => {
                const load = async (counter) => {
                    try {
                        if (counter >= 10)
                            return reject();
                        const response = await fetch(`${utils_2.IPFS_SCOM_URL}/${cid}`);
                        if (response.ok) {
                            resolve(response.json());
                        }
                        else {
                            return load(++counter);
                        }
                    }
                    catch (err) {
                        return load(++counter);
                    }
                };
                load(0);
            });
        }
        render() {
            return (this.$render("i-vstack", { class: index_css_1.default, width: "100%", height: "100%", background: { color: Theme.background.main } },
                this.$render("i-panel", { stack: { grow: "1" }, overflow: "hidden" },
                    this.$render("i-vstack", { id: "pnlLoading", height: "100%", horizontalAlignment: "center", verticalAlignment: "center", padding: { top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }, visible: false },
                        this.$render("i-panel", { class: 'spinner' })),
                    this.$render("i-grid-layout", { id: "gridMain", height: "100%", templateColumns: ["1fr"] },
                        this.$render("scpage-viewer-sidebar", { id: "viewerSidebar", visible: false, overflow: "auto", onTreeViewActiveChange: this.renderPage.bind(this) }),
                        this.$render("scpage-viewer-body", { id: "viewerBody", overflow: "auto", onUpdatePage: this.renderPage.bind(this) })))));
        }
    };
    Viewer = __decorate([
        components_9.customModule
    ], Viewer);
    exports.default = Viewer;
});
