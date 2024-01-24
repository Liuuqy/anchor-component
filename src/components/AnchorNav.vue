<template>
    <div>
        <!-- 右侧导航栏 -->
        <div class="anchor clearfix" ref="anchor">
            <div class="sidebar-bd">
                <div class="anchor__nav card">
                    <!-- 锚点定位 回到顶部 -->
                    <ul class="sidebar-anchor-list">
                        <div class="left-border">
                            <li v-for="(item,key) in anchorList"
                            :key="key"
                            :class="{active:active===item.anchor}"
                            @click="anchorPosition(item.anchor)"
                            >
                                <span class="circle"></span>
                                <span class="ellipsis" :title="item.title">{{ item.title }}</span>
                            </li>
                        </div>
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
import animateScrollTo from 'animated-scroll-to';
import throttle from '../../utils/throttle'
export default {
    name: 'AnchorNav',
    props: {
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
    watch:{
        
    },
    data(){
        return{
            anchorNavData:{},
            valueType: 1, //当前楼层改变的类型，1是组件传递、按钮直达改变，2是通过滚动监听自动改变
            children: [],
            offsetTopList:[],
            active:'',
        }
    },
    computed:{
        scrollWrap(){
            console.log('dom的ID值',this.scrollDom)
            if(this.scrollDom){
                return document.getElementById(this.scrollDom)
            }else{
                return null
            }
            //不传递默认取离元素最近的可以滚动的元素暂时先不实现
        }
    },
    methods:{
        //获取锚点距离父级元素的顶部距离,注意这里的父级元素
        anchorPosition(anchor) {
            //取消监听
            this.scrollWrap.removeEventListener('scroll', this.scrollHandle)
            console.log('点击锚点为：',anchor)
            const element = document.getElementById(anchor)
            console.log('滚动元素为',element)
            //offsetTop:距离父元素顶部的偏移
            console.log('偏移量为:',element.offsetTop)
            // this.scrollTo(element.offsetTop)
            this.active = ''
            this.active = anchor
            // this.$nextTick(()=>{
            //     this.active = anchor
            // })
            //恢复监听
            //使用模拟滚动代替真实滚动，避免由于我们在跳转anchor时一直开启滚动监听事件，造成经过的anchor都高亮的问题
            animateScrollTo(element.offsetTop,{speed:100, elementToScroll: this.scrollWrap}).then(()=>{
                // this.scrollWrap.addEventListener('scroll', function(){
                //     this.scrollHandle(this.scrollWrap,flag=false)
                // })
                this.scrollWrap.addEventListener('scroll',this.scrollHandle)
            })
        },
        //父级元素滚动
        scrollTo(offsetTop){
            console.log('调用滚动函数')
            console.log('父级元素为:', this.scrollWrap)
            this.scrollWrap.scrollTo({
                top:offsetTop,
                behavior:'smooth'
            })
        },
        //页面挂载后先拿到所有锚点的offsetTop，
        //从小到大放到一个数组offsetTopList里方便后面使用；
        setOffsetTopList(){
            console.log('待遍历anchor',this.anchorList)
            this.offsetTopList = this.anchorList.map((item)=>{
                console.log('具体item',item)
                const element = document.getElementById(item.anchor)
                console.log('element:',element)
                return {
                    anchor:item.anchor,
                    offsetTop:element.offsetTop
                }
            })
        },
        scrollHandle({target}){
            //如果已经到达底部，不再进行后面的判断：避免anchor高亮后经过判断又取消的问题
            //scrollTop + clientHeight == scrollHeight
            //是否找到了匹配的滚动位置
            let flag = true
            const curScrollTop = target.scrollTop //当前滚动高度
            const clientHeight = target.clientHeight //
            const scrollHeight = target.scrollHeight //页面总高度
            if(curScrollTop+clientHeight === scrollHeight){
                console.log('已经到达底部')
                flag = false
            }
            console.log('当前滚动位置',curScrollTop)
            if (!this.offsetTopList.lenth) {
                this.setOffsetTopList()
            }
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
                if (flag && curScrollTop >= curReference-20) {
                    console.log('进入某个区域')
                    flag = false
                    this.active = this.offsetTopList[i].anchor
                }
            }
        },
        throttleScroll(){
            throttle(this.scrollHandle, 100)
        }
    },
    mounted(){
        console.log('dom节点',this.scrollDom)
        console.log('dom2',document.getElementById(this.scrollDom))
        this.setOffsetTopList()
        console.log('偏移量数组3，挂载后', this.offsetTopList)
        // this.scrollWrap.addEventListener('scroll', function(){
        //     this.scrollHandle(flag=true)
        // })
        this.scrollWrap.addEventListener('scroll',this.scrollHandle)
        // window.addEventListener('scroll',this.scrollHandle)
    },
    beforeDestroy(){
        this.scrollWrap.removeEventListener('scroll',this.scrollHandle)
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.anchor__nav.card {
  @headerHeight:50px;
  @mainColor:#409EFF;
  position: fixed;
  top: @headerHeight;
  z-index: 10;
  float: right;
  left:85%;
  min-width: 200px;
  padding: 15px 20px;
  li {
    list-style: none;
    line-height: 10px;
    font-size: 14px;
    height: 10px;
    width: fit-content;
    user-select: none;
    margin: 20px 0;
    cursor: pointer;
    &:hover {
      color: @mainColor;
    }
    &.active {
      color:@mainColor;
      .circle{
        visibility: visible;
      }
    }
    &.disabled {
      color: #ccc;
      cursor: not-allowed;
    }
    i {
      margin-right: 6px;
      vertical-align: top;
    }
    .ellipsis {
      display: inline-block;
      min-width: 140;
    }
    .circle{
        margin-left: 8px;
        display: inline-block;
        height: 9px;
        width: 9px;
        border-radius: 50%;
        box-sizing: border-box;
        border:2px solid  #409EFF;
        background-color: #fff;
        visibility: hidden;
    }
  }
}
</style>