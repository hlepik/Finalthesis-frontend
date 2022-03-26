import _ from 'lodash';
export function isBlank(str: string): boolean {
    return _.isNull(str) || _.isEmpty(str.replaceAll(' ', ''));
}