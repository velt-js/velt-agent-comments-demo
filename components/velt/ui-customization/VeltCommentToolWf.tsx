import { VeltCommentToolWireframe } from "@veltdev/react";
import { CommentPlusIcon } from "@/components/icons";

// Comment Tool wireframe — every <VeltCommentTool> in the app renders as this
// row. It only lives inside the table's kebab dropdown, so it is shaped as a
// menu item rather than the SDK's default floating icon button.
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
