import { VeltCommentToolWireframe } from "@veltdev/react";
import { CommentPlusIcon } from "@/components/icons";

export function VeltCommentToolWf() {
  return (
    <VeltCommentToolWireframe>
      <span className="hv-menu-row">
        <CommentPlusIcon />
        <span>Add comment</span>
      </span>
    </VeltCommentToolWireframe>
  );
}
