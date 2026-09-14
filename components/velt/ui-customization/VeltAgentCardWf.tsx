"use client";

import {
    VeltCommentDialogProgressWireframe,
    VeltCommentDialogWireframe,
} from "@veltdev/react";
import type { ReactNode } from "react";
import { SparklesIcon } from "./icons";

export function VeltAgentCardWf({
    header,
    showOpenComment = false,
}: {
    header?: ReactNode;
    showOpenComment?: boolean;
}) {
    return (
        <VeltCommentDialogWireframe.Suggestion>
            <div className="hw-agent-card">
                {header}
                <VeltCommentDialogWireframe.Suggestion.Banner />
                <VeltCommentDialogWireframe.Suggestion.Header>
                    <VeltCommentDialogWireframe.Suggestion.Header.Agent>
                        <VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar className="vc-avatar">
                            <span className="vc-avatar-glyph">
                                <SparklesIcon />
                            </span>
                        </VeltCommentDialogWireframe.Suggestion.Header.Agent.Avatar>
                        <VeltCommentDialogWireframe.Suggestion.Header.Agent.Name className="vc-name" />
                    </VeltCommentDialogWireframe.Suggestion.Header.Agent>
                    <VeltCommentDialogWireframe.Suggestion.Header.Timestamp className="vc-time" />
                </VeltCommentDialogWireframe.Suggestion.Header>
                <VeltCommentDialogWireframe.Suggestion.Body />
                <VeltCommentDialogProgressWireframe />
                <VeltCommentDialogWireframe.Suggestion.Footer>
                    <div className="hw-agent-footer">
                        <VeltCommentDialogWireframe.Suggestion.Actions>
                            <div className="hw-suggestion-actions">
                                <VeltCommentDialogWireframe.Suggestion.Actions.Accept />
                                <VeltCommentDialogWireframe.Suggestion.Actions.Reject />
                            </div>
                        </VeltCommentDialogWireframe.Suggestion.Actions>
                        {showOpenComment ? (
                            <VeltCommentDialogWireframe.Suggestion.Footer.OpenComment />
                        ) : null}
                    </div>
                </VeltCommentDialogWireframe.Suggestion.Footer>
            </div>
        </VeltCommentDialogWireframe.Suggestion>
    );
}

export default VeltAgentCardWf;
