import {
  Module,
  customElements,
  ControlElement,
  HStack
} from '@ijstech/components';
import { IRowData } from './interface';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['sc-page-viewer-row']: ControlElement;
    }
  }
}

@customElements('sc-page-viewer-row')
export class ViewrRow extends Module {
  private pnlSections: HStack;
  private rowData: IRowData;

  async setData(rowData: IRowData) {
    this.pnlSections.clearInnerHTML();
    this.rowData = rowData;
    if (this.rowData.config.width) {
      this.width = this.rowData.config.width;
    }
    if (this.rowData.config.height) {
      // use minHeight instead of height to avoid the overflow of inner containers
      // when the markdown editor is in edit mode
      this.minHeight = this.rowData.config.height;
    }
    const columnsSettings = this.rowData.config.columnsSettings || {};
    if (this.rowData.sections && this.rowData.sections.length > 0) {
      for (let i = 0; i < this.rowData.sections.length; i++) {
        const colSettings = columnsSettings[i];
        const sectionData = this.rowData.sections[i];
        const pageSection = (<sc-page-viewer-section maxWidth={colSettings?.width || ''} containerSize={colSettings?.size || {}}></sc-page-viewer-section>);
        this.pnlSections.append(pageSection);
        await pageSection.setData(sectionData);
      }
    }
  }

  render() {
    return (
      <i-hstack id="pnlSections" verticalAlignment='center'></i-hstack>
    )
  }
}
