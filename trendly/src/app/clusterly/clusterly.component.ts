import {Component, SimpleChanges, OnChanges} from '@angular/core';

import {InputObj} from '../clusterly-inputs/clusterly-inputs.component';
import {DataService} from '../data.service';

import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';
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
  private checklistSelection: SelectionModel<ItemFlatNode> =
      new SelectionModel<ItemFlatNode>(true /* multiple */);
  private database: ChecklistDatabase;
  // TODO: get data from child (clusters-section).
  clusters: Map<number, Cluster> = new Map<number, Cluster>();
  clustersToShow: Map<number, Cluster>;

  log(val) { console.log(val); }

  constructor(private dataService: DataService) {
    const cluster1 = new Cluster('aaa', 0, 10, [], [], [1, 2]);
    const cluster2 = new Cluster('bbb', 1, 10, [], [], [0]);
    const cluster3 = new Cluster('ccc', 2, 10, [], [], [0]);
    this.clusters.set(0, cluster1);
    this.clusters.set(1, cluster2);
    this.clusters.set(2, cluster3);
    this.changeView();
  }
  changeView(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    this.database = new ChecklistDatabase(this.clusters);
    this.treeFlattener = new MatTreeFlattener(
    this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl =
    new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource =
    new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.database.dataChange.subscribe(data => {
    this.dataSource.data = data;
    });

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
        flatNode.expandable = !!node.children;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
      }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(
        child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result =
        descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /**
   * Toggle the to-do item selection. Select/deselect all the descendants node
   */
  todoItemSelectionToggle(node: ItemFlatNode): void {
    this.checklistSelection.toggle(node);
    console.log(this.checklistSelection.selected);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node) ?
        this.checklistSelection.select(...descendants) :
        this.checklistSelection.deselect(...descendants);
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
    console.log(this.clustersToShow);
  }
}
