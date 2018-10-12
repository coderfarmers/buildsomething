import * as React from 'react'
import { Component, ComponentType } from 'react'
import { Store } from 'redux'

export default function <P=any>(WrapperComponent: ComponentType, store: Store, type?: string) {
    return class extends Component<P>{
        state = type ? (store.getState()) : store.getState()[type];
        private unsubscribe: Function = () => '';

        private handleStoreSubscribe = () => {
            const state = store.getState();
            this.setState(type ? state[type] : state);
        };

        componentWillUnmount() { this.unsubscribe() }
        componentDidMount() { this.unsubscribe = store.subscribe(this.handleStoreSubscribe) }
        render() {
            return <WrapperComponent {...this.state} {...this.props} />
        }
    }
}