<template>
    <div>
        <!-- 右侧导航栏 -->
        <div class="anchor clearfix" ref="anchor">
            <div class="sidebar-bd">
            <div class="anchor__nav card">
                <!-- 锚点定位 回到顶部 -->
                <ul class="sidebar-anchor-list">
                    <li v-for="(item,key) in anchorList"
                    :key="key"
                    :class="{active:active===item.anchor}"
                    @click="anchorPosition(item.anchor)"
                    >
                    <span class="ellipsis" :title="item.label">{{ item.label }}</span>
                    </li>
                </ul>
            </div>
            </div>
        </div>
        <div class="anchor__content">
            <slot></slot>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'AnchorNav',
    props: {
        // //当前楼层
        // active:{
        //     type:String,
        //     default:''
        // },
        // 滚动的元素，不传默认取离元素最近的可以滚动的元素
        scrollDom:{
            type:String,
            required:true,
            default:''
        },
        //固定在滚动区域类的高度
        fixedHeight:{
            type:Number,
            default:54
        },
        //
        anchorList:{
            type:Array,
            required:true
        }
    },
    data(){
        return{
            anchorNavData:{},
            valueType: 1, //当前楼层改变的类型，1是组件传递、按钮直达改变，2是通过滚动监听自动改变
            children: [],
            offsetTopList:[],
            active:''
        }
    },
    computed:{
        scrollWrap(){
            if(this.scrollDom){
                return document.getElementById('app')
            }else{
                return null
            }
            //不传递默认取离元素最近的可以滚动的元素暂时先不实现
        }
    },
    methods:{
        //获取锚点距离父级元素的顶部距离,注意这里的父级元素
        anchorPosition(anchor) {
            console.log('点击锚点为：',anchor)
            const element = document.getElementById(anchor)
            console.log('滚动元素为',element)
            //offsetTop:距离父元素顶部的偏移
            console.log('偏移量为:',element.offsetTop)
            this.scrollTo(element.offsetTop)
        },
        //父级元素滚动
        scrollTo(offsetTop){
            console.log('调用滚动函数')
            console.log('父级元素为:',this.scrollWrap)
            this.scrollWrap.scrollTo({
                top:offsetTop,
                behavior:'smooth'
            })
        },
        //页面挂载后先拿到所有锚点的offsetTop，
        //从小到大放到一个数组offsetTopList里方便后面使用；
        setOffsetTopList(){
            this.offsetTopList = this.anchorList.map((item)=>{
                const element = document.getElementById(item.anchor)
                return {
                    anchor:item.anchor,
                    offsetTop:element.offsetTop
                }
            })
            console.log(this.offsetTopList)
        },
        scrollHandle({target}){
            // console.log(target)
            //获取当前滚动元素的距离
            const curScrollTop = target.scrollTop
            console.log('当前滚动位置',curScrollTop)
            //是否找到了匹配的滚动位置
            let flag = true
            //获取一个保存页面上所有锚点位置信息的数组
            const len = this.offsetTopList.length
            //获取第一个锚点的位置
            const min = this.offsetTopList[0].offsetTop
            //未匹配到任何锚点
            if (curScrollTop < min) {
                // sidebarStore.setAnchor('')
                this.active = '' //无匹配
                return
            }
            for (let i = len - 1; i >= 0; i--) {
                const curReference = this.offsetTopList[i].offsetTop // 当前参考值
                if (flag && curScrollTop >= curReference - 10) {
                    console.log('进入某个区域')
                    flag = false
                    this.active = this.offsetTopList[i].anchor
                }
            }
        }
    },
    mounted(){
        this.setOffsetTopList()
        this.scrollWrap.addEventListener('scroll',this.scrollHandle)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.anchor__nav.card {
  @headerHeight:50px;
  @mainColor:blue;
  position: fixed;
  top: @headerHeight;
  z-index: 10;
  float: right;
  width: 200px;
  padding: 15px 20px;

  li {
    line-height: 20px;
    height: 20px;
    width: fit-content;
    user-select: none;
    margin: 20px 0;
    cursor: pointer;
    &:hover {
      color: @mainColor;
    }
    &.active {
      color: red;
      font-size: large;
    }
    &.disabled {
      color: #ccc;
      cursor: not-allowed;
    }
    i {
      margin-right: 6px;
      vertical-align: top;
    }
    span {
      display: inline-block;
      max-width: 140px;
    }
  }
}
</style>