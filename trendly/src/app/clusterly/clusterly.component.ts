import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable} from 'rxjs';

import {InputObj} from '../clusterly-inputs/clusterly-inputs.component';
import {DataService} from '../data.service';
import {Cluster} from '../models/cluster-model';

/**
 * Node for cluster in the hirarchy tree.
 */
export class ItemNode {
  children: ItemNode[];
  item: Cluster;
}

/**
 * Flat cluster item node with expandable and level information (child -
 * related topic or parent).
 */
export class ItemFlatNode {
  item: Cluster;
  level: number;
  expandable: boolean;
}



/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added
 * under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange: BehaviorSubject<ItemNode[]> = new BehaviorSubject<ItemNode[]>([]);
  // TODO: make sure to pass in ctor'.
  readonly allClusters: Map<number, Cluster>;

  /**
   * Returns data change value.
   */
  // get data(): ItemNode[] {
  //   return this.dataChange.value;
  // }

  constructor(allClusters: Map<number, Cluster>) {
    this.allClusters = allClusters;
    this.initialize();
  }

  /**
   * Build the data for the hirarchical tree and updates dataChange.
   */
  initialize(): void {
    const data: ItemNode[] = this.buildFileTree(this.allClusters, 0);
    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree with ItemNode classin order do display all
   * clusters and related clusters.
   */
  buildFileTree(obj: Map<number, Cluster>, level: number): ItemNode[] {
    const nodes: ItemNode[] = [];
    for (const [key, val] of obj) {
      const newNode = new ItemNode();
      newNode.item = val;
      newNode.children = [];
      for (const id of val.relatedClustersIds) {
        const child = new ItemNode();
        child.item = obj.get(id);
        newNode.children.push(child);
      }
      nodes.push(newNode);
    }
    return nodes;
  }
}

/**
 * Clusterly component - includes Clusterly inputs & clusters-section
 * components and handles fetching data from server based on the user inputs and
 * transfering the returnd data to the relevant component.
 */
@Component({
  selector: 'app-clusterly',
  templateUrl: './clusterly.component.html',
  styleUrls: ['./clusterly.component.css']
})
export class ClusterlyComponent {
  dataFromServer: any;
  isLoading: boolean = false;



  /**
   * Map from flat node to nested node. This helps us finding the nested node
   * to be modified
   */
  private flatNodeMap: Map<ItemFlatNode, ItemNode> =
      new Map<ItemFlatNode, ItemNode>();

  /**
   * Map from nested node to flattened node. This helps us to keep the same
   * object for selection
   */
  private nestedNodeMap: Map<ItemNode, ItemFlatNode> =
      new Map<ItemNode, ItemFlatNode>();

  /** A selected parent node to be inserted */
  // selectedParent: ItemFlatNode|null = null;

  /** The new item's name */
  // newItemName = '';
  treeControl: FlatTreeControl<ItemFlatNode>;
  private treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;
  dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

  /** The selection for checklist */
  checklistSelection: SelectionModel<ItemFlatNode> =
      new SelectionModel<ItemFlatNode>(true /* multiple */);
  private database: ChecklistDatabase;
  // TODO: get data from child (clusters-section).
  clusters: Map<number, Cluster> = new Map<number, Cluster>();
  clustersToShow: Map<number, Cluster>;

  private selectedID: Set<number> = new Set<number>();

  log(val) {
    console.log(val);
  }

  constructor(private dataService: DataService) {
    // const cluster1 = new Cluster('aaa', 0, 10, [], [], [1, 2]);
    // const cluster2 = new Cluster('bbb', 1, 10, [], [], [0]);
    // const cluster3 = new Cluster('ccc', 2, 10, [], [], [0]);
    // this.clusters.set(0, cluster1);
    // this.clusters.set(1, cluster2);
    // this.clusters.set(2, cluster3);
    this.changeView();
  }
  changeView(): void {
    this.clustersToShow = new Map<number, Cluster>();
    // Called before any other lifecycle hook. Use it to inject dependencies,
    // but avoid any serious work here. Add '${implements OnChanges}' to the
    // class.
    const sortedClusters: Map<number, Cluster> = new Map(
        [...this.clusters.entries()].sort((a, b) => b[1].volume - a[1].volume));
    this.database = new ChecklistDatabase(sortedClusters);
    this.treeFlattener = new MatTreeFlattener(
        this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl =
        new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource =
        new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    // keep all the previous selections selected.
    this.checklistSelection =
        new SelectionModel<ItemFlatNode>(true /* multiple */);
    this.selectedID.forEach((id) => {
      if (!this.clusters.has(id)) {
        this.selectedID.delete(id)
      }
    });
    this.dataSource._flattenedData
        .forEach((nodes) => {
          nodes.forEach((node) => {
            if (this.selectedID.has(node.item.id)) {
              this.checklistSelection.select(node)
            }
          });
        });
      this.updateClustersToShow();
  }

  getDataFromServer(input: InputObj) {
    this.isLoading = true;
    this.dataService
        .fetchClustrlyData(
            input['terms'], input['startDate'], input['endDate'],
            input['country'], 1, input['category'])
        .subscribe(
            (data) => {
              this.dataFromServer = {...data};
              this.isLoading = false;
            },
            (err) => {
              console.log(err);
              alert(
                  'An error occurred while processing your request. Please try again.')
            });
  }

  getLevel = (node: ItemFlatNode) => node.level;

  isExpandable = (node: ItemFlatNode) => node.expandable;

  getChildren = (node: ItemNode): ItemNode[] => node.children;

  hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

  // hasNoContent = (_: number, _nodeData: ItemFlatNode) =>
  //     _nodeData.item === null;

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps
   * for later use.
   */
  transformer =
      (node: ItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.item === node.item ?
            existingNode :
            new ItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.expandable =
            (node.children != undefined && node.children.length === 0) ?
            false :
            !!node.children;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
      }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return (descendants.length === 0) ?
        false :
        descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    if (this.checklistSelection.isSelected(node)) return true;
    const descendants = this.treeControl.getDescendants(node);
    const result =
        descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  // /**
  //  * Toggle the to-do item selection. Select/deselect all the descendants
  //  node
  //  */
  // ItemSelectionToggle(node: ItemFlatNode): void {
  //   const id : number = node.item.id;
  //   console.log(this.dataSource._flattenedData);
  //   this.dataSource._flattenedData.forEach((nodes) => {
  //     nodes.forEach((node) => {
  //       if (node.item.id === id) {
  //         if (node.level == 0) {
  //           this.parentItemSelectionToggle(node);
  //           // this.handleChildes(this.treeControl.getChildren(node),
  //           !this.selectedID.has(id))

  //         }
  //         else {
  //           this.childItemSelectionToggle(node);
  //         }
  //       }
  //     });
  //   });

  //   //update ID set
  //   if (this.checklistSelection.isSelected(node)) {
  //     this.selectedID.add(id);
  //   }
  //   else {
  //     this.selectedID.delete(id);
  //   }
  // }


  /**
   * Toggle the to-do item selection. Select/deselect all the descendants node
   */
  parentItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    console.log(this.checklistSelection.selected);
    const descendants = this.treeControl.getDescendants(node);
    if (this.checklistSelection.isSelected(node)) {
      this.selectedID.add(node.item.id);
      this.checklistSelection.select(...descendants);
      descendants.forEach((node) => {
        this.selectedID.add(node.item.id);
      });
    } else {
      this.selectedID.delete(node.item.id);
      this.checklistSelection.deselect(...descendants);
      descendants.forEach((node) => {
        this.selectedID.delete(node.item.id);
      });
    }

    this.updateClustersToShow();
  }

  childItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checklistSelection.isSelected(node) ?
        this.selectedID.add(node.item.id) :
        this.selectedID.delete(node.item.id);
    this.updateClustersToShow();
  }

  /**
   * Update clusters to show according the selections.
   */
  updateClustersToShow() {
    this.clustersToShow = new Map<number, Cluster>();
    this.checklistSelection.selected.forEach((item: ItemFlatNode) => {
      (!this.clustersToShow.has(item.item.id)) ?
          this.clustersToShow.set(item.item.id, item.item) :
          null;
      console.log(item);
    });
    this.clustersToShow = new Map(
      [...this.clustersToShow.entries()].sort((a, b) => a[1].volume - b[1].volume));
    console.log(this.clustersToShow);
  }
}
