<template>
  <view>
    <!-- 顶部导航 -->
    <fa-navbar title="收藏列表" :border-bottom="false"></fa-navbar>

    <view class="bg-white u-m-b-30">
      <u-swipe-action
        v-for="(res, index) in list"
        :show="res.show"
        :index="index"
        :key="res.id"
        @open="open"
        @click="click"
        :options="options"
      >
        <view class="comment" @click="goDetail(res)">
          <view class="left">
            <image :src="res.image" mode="aspectFill"></image>
          </view>
          <view class="right">
            <view class="content u-line-2">{{ res.title }}</view>
            <view class="reply-box">
              <view class="u-tips-color">收藏于:{{ res.create_date }}</view>
            </view>
          </view>
        </view>
      </u-swipe-action>
    </view>
    <!-- 空数据 -->
    <view class="u-flex u-row-center fa-empty top-15" v-if="is_empty">
      <image src="../../static/image/data.png" mode=""></image>
      <view class="u-tips-color">没有更多的收藏数据了~</view>
    </view>
    <!-- 加载更多 -->
    <view class="u-p-b-30" v-if="list.length"
      ><u-loadmore bg-color="#f4f6f8" :status="has_more ? status : 'nomore'"
    /></view>
    <!-- 回到顶部 -->
    <u-back-top
      :scroll-top="scrollTop"
      :icon-style="{ color: theme.bgColor }"
      :custom-style="{ backgroundColor: theme.lightColor }"
    ></u-back-top>
    <!-- 底部导航 -->
    <fa-tabbar></fa-tabbar>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.collectList();
  },
  onShow() {
    if (this.isFirst && !this.vuex_token) {
      uni.$u.route({
        type: "back",
      });
      return;
    }
    this.isFirst = true;
  },
  data() {
    return {
      isFirst: false,
      status: "loadmore",
      has_more: false,
      scrollTop: 0,
      is_update: false,
      is_empty: false,
      page: 1,
      show: false,
      list: [],
      options: [
        {
          text: "移除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
    };
  },
  methods: {
    goDetail(item) {
      let p = "";
      switch (item.type) {
        case "page":
        case "diyform":
          break;
        case "archives":
          p = "/pages/course/sound-detail";
          break;
        case "special":
          p = "/pages/special/detail";
          break;
        default:
          break;
      }
      if (p.length > 0) {
        this.$u.route(p, {
          id: item.aid,
        });
      } else {
        this.$u.toast("暂不支持查看");
      }
    },
    collectList() {
      this.$api.articleCollectList({ page: this.page }).then((result) => {
        this.status = "loadmore";
        let { code, data: res, msg } = result;
        if (code == 1) {
          let { collectionList } = res;
          if (this.is_update) {
            this.list = [];
            this.is_update = false;
          }
          collectionList.data.map((item) => {
            item.show = false;
          });
          this.list = [...this.list, ...collectionList.data];
          this.has_more =
            collectionList.last_page > collectionList.current_page;
          this.is_empty = !this.list.length;
        }
      });
    },
    click(index, index1) {
      this.$api
        .delCollection({
          id: this.list[index].id,
        })
        .then((res) => {
          this.$u.toast(res.msg);
          if (res.code == 1) {
            this.list.splice(index, 1);
            this.is_empty = !this.list.length;
          }
        });
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.list[index].show = true;
      this.list.map((val, idx) => {
        if (index != idx) this.list[idx].show = false;
      });
    },
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onReachBottom() {
    if (this.has_more) {
      this.status = "loading";
      this.page = this.page + 1;
      this.collectList();
    }
  },
};
</script>

<style lang="scss">
page {
  background-color: #f4f6f8;
}
</style>
<style lang="scss" scoped>
.comment {
  display: flex;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
  width: 100vw;

  .left {
    image {
      width: 180rpx;
      height: 130rpx;
      background-color: #f2f2f2;
      border-radius: 10rpx;
    }
  }

  .right {
    flex: 1;
    padding-left: 20rpx;
    font-size: 28rpx;

    .content {
      margin-bottom: 10rpx;
    }

    .reply-box {
      word-break: break-word;
    }
  }
}
.hoter-list {
  border-radius: 10rpx;
  .item {
    position: relative;
    .collect {
      background: rgba($color: #000000, $alpha: 0.2);
      border-radius: 200rpx;
      position: absolute;
      right: 30rpx;
      top: 20rpx;
      padding: 10rpx;
      z-index: 9999;
    }
    .images {
      position: relative;
      .title {
        color: #ffffff;
        width: 100%;
        position: absolute;
        left: 0rpx;
        bottom: 0rpx;
        padding: 20rpx 10rpx;
        background: rgba($color: #000000, $alpha: 0.4);
      }
    }

    .price {
      font-weight: bold;
    }
    .market_price {
      text-decoration: line-through;
      margin-left: 10rpx;
    }
  }
}

.thumb-box {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 30rpx 0;

  .item-menu-image {
    width: 200rpx;
    height: 150rpx;
    border-radius: 5rpx;
  }
  .right {
    width: 500rpx;
    height: 150rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .item-menu-name {
    font-weight: normal;
    color: $u-main-color;
  }
  .intro {
    font-size: 20rpx;
    padding: 10rpx 0;
  }
  .market_price {
    text-decoration: line-through;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #f4f6f8;
  }
}
</style>
