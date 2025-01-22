declare module 'react-treeview' {
    import { Component, ReactNode } from 'react';
  
    interface TreeViewProps {
      nodeLabel: ReactNode;
      defaultCollapsed?: boolean;
      onClick?: () => void;
      children?: ReactNode;
    }
  
    export default class TreeView extends Component<TreeViewProps> {}
  }
  