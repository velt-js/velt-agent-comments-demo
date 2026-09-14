"use client";

import { VeltCommentDialogWireframe } from "@veltdev/react";
import { ComposerFieldContents } from "./VeltComposerWf";

export function VeltPageModeComposerWf() {
    return (
        <VeltCommentDialogWireframe variant="pageModeComposer">
            <VeltCommentDialogWireframe.Composer className="vc-composer-page-field">
                <ComposerFieldContents inputClass="vc-composer-page-input" placeholder="New Comment" />
            </VeltCommentDialogWireframe.Composer>
        </VeltCommentDialogWireframe>
    );
}

export default VeltPageModeComposerWf;
